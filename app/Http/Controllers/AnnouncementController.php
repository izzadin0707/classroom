<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\Classroom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    /**
     * Store a newly created announcement in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'class_id' => 'required|exists:classrooms,id',
            'file' => 'nullable|file|max:10240', // max 10MB
        ]);

        // Check if user is authorized to create announcements in this classroom
        $classroom = Classroom::findOrFail($request->class_id);
        if ($classroom->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $announcement = new Announcement();
        $announcement->title = $request->title;
        $announcement->content = $request->content;
        $announcement->class_id = $request->class_id;
        $announcement->user_id = Auth::id();

        // Handle file upload
        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('announcements', 'public');
            $announcement->file_path = $path;
            $announcement->file_name = $request->file('file')->getClientOriginalName();
        }

        $announcement->save();

        return redirect()->back();
    }

    /**
     * Update the specified announcement in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'file' => 'nullable|file|max:10240', // max 10MB
        ]);

        $announcement = Announcement::findOrFail($id);

        // Check if user is authorized to update this announcement
        if ($announcement->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $announcement->title = $request->title;
        $announcement->content = $request->content;

        // Handle file upload
        if ($request->hasFile('file')) {
            // Delete old file if exists
            if ($announcement->file_path) {
                Storage::disk('public')->delete($announcement->file_path);
            }
            
            // Store new file
            $path = $request->file('file')->store('announcements', 'public');
            $announcement->file_path = $path;
            $announcement->file_name = $request->file('file')->getClientOriginalName();
        }

        $announcement->save();

        return redirect()->back();
    }

    /**
     * Remove the specified announcement from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $announcement = Announcement::findOrFail($id);

        // Check if user is authorized to delete this announcement
        if ($announcement->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Delete file if exists
        if ($announcement->file_path) {
            Storage::disk('public')->delete($announcement->file_path);
        }

        $announcement->delete();

        return redirect()->back();
    }
}