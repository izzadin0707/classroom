<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\Classroom;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redirect;

class AssignmentController extends Controller
{
    /**
     * Store a newly created assignment in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'required|date',
            'file' => 'nullable|file|max:10240', // Max 10MB
            'class_id' => 'required|exists:classrooms,id',
        ]);

        // Verifikasi bahwa pengguna adalah pemilik kelas
        $classroom = Classroom::findOrFail($request->class_id);
        if ($classroom->user_id !== auth()->id()) {
            return back()->with('error', 'You are not authorized to add assignments to this class.');
        }

        $assignment = new Assignment();
        $assignment->class_id = $request->class_id;
        $assignment->title = $request->title;
        $assignment->description = $request->description;
        $assignment->due_date = $request->due_date;

        // Handle file upload
        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('assignments', 'public');
            $assignment->file_path = $path;
        }

        $assignment->save();

        return back()->with('success', 'Assignment created successfully.');
    }

    /**
     * Update the specified assignment in storage.
     */
    public function update(Request $request, Assignment $assignment)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'required|date',
            'file' => 'nullable|file|max:10240', // Max 10MB
        ]);

        // Verifikasi bahwa pengguna adalah pemilik kelas
        $classroom = Classroom::findOrFail($assignment->class_id);
        if ($classroom->user_id !== auth()->id()) {
            return back()->with('error', 'You are not authorized to update this assignment.');
        }

        $assignment->title = $request->title;
        $assignment->description = $request->description;
        $assignment->due_date = $request->due_date;

        // Handle file upload
        if ($request->hasFile('file')) {
            // Delete old file if exists
            if ($assignment->file_path && Storage::disk('public')->exists($assignment->file_path)) {
                Storage::disk('public')->delete($assignment->file_path);
            }
            
            $path = $request->file('file')->store('assignments', 'public');
            $assignment->file_path = $path;
        }

        $assignment->save();

        return back()->with('success', 'Assignment updated successfully.');
    }

    /**
     * Remove the specified assignment from storage.
     */
    public function destroy(Assignment $assignment)
    {
        // Verifikasi bahwa pengguna adalah pemilik kelas
        $classroom = Classroom::findOrFail($assignment->class_id);
        if ($classroom->user_id !== auth()->id()) {
            return back()->with('error', 'You are not authorized to delete this assignment.');
        }

        // Delete file if exists
        if ($assignment->file_path && Storage::disk('public')->exists($assignment->file_path)) {
            Storage::disk('public')->delete($assignment->file_path);
        }

        $assignment->delete();

        return back()->with('success', 'Assignment deleted successfully.');
    }
}