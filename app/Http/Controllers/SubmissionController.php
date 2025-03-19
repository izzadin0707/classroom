<?php

namespace App\Http\Controllers;

use App\Models\Submission;
use App\Models\Assignment;
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

    public function list($assignmentId)
    {
        $submissions = Submission::where('assignment_id', $assignmentId)
            ->with('users')
            ->get();

        return response()->json($submissions);
    }
    
    public function destroy(Submission $submission)
    {
        // Pastikan hanya pemilik submission yang bisa menghapus
        if ($submission->student_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        // Hapus file jika ada
        if ($submission->file_path) {
            Storage::disk('public')->delete($submission->file_path);
        }
        
        $submission->delete();
        
        return redirect()->back();
    }
}