<?php

namespace App\Http\Controllers;

use App\Models\Submission;
use App\Models\Assignment;
use App\Models\SubmissionComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class SubmissionController extends Controller
{
    public function upload(Request $request, $assignmentId)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf,doc,docx,zip',
        ]);

        $filePath = $request->file('file')->store('submissions', 'public');

        Submission::updateOrCreate(
            [
                'assignment_id' => $assignmentId,
                'student_id' => Auth::id(),
            ],
            [
                'file_path' => $filePath,
                'submitted_at' => now(),
            ]
        );

        return redirect()->back();
    }

    public function update(Request $request, $id)
    {
        $submission = Submission::findOrFail($id);
        $submission->status = $request->status;
        $submission->save();

        SubmissionComment::create([
            'submission_id' => $id,
            'user_id' => null,
            'message' => "Submission marked as {$request->status}",
            'is_system' => true,
        ]);

        return response()->json($submission);
    }

    public function list($assignmentId)
    {
        $assignment = Assignment::with('classroom.members')->findOrFail($assignmentId);
        
        $memberIds = $assignment->classroom->members->pluck('user_id')->toArray();
        
        $submissions = Submission::where('assignment_id', $assignmentId)
            ->whereIn('student_id', $memberIds)
            ->with('users')
            ->get();

        return response()->json($submissions);
    }
    
    public function destroy(Submission $submission)
    {
        if ($submission->student_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        if ($submission->file_path) {
            Storage::disk('public')->delete($submission->file_path);
        }
        
        $submission->delete();
        
        return redirect()->back();
    }

    public function getMessages($id)
    {
        $messages = SubmissionComment::where('submission_id', $id)
                    ->with('user')
                    ->orderBy('created_at', 'asc')
                    ->get();

        return response()->json($messages);
    }

    public function storeMessage(Request $request, $id)
    {
        $message = SubmissionComment::create([
            'submission_id' => $id,
            'user_id' => Auth::id(),
            'message' => $request->message,
            'is_system' => false,
        ]);

        $message->load('user');

        return response()->json($message);
    }
}