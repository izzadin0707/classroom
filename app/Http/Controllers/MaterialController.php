<?php

namespace App\Http\Controllers;

use App\Models\Material;
use App\Models\Classroom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MaterialController extends Controller
{
    /**
     * Store a newly created material in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file' => 'nullable|file|max:10240', // 10MB max
            'class_id' => 'required|exists:classrooms,id',
        ]);
        
        // Check if user is the owner of the classroom
        $classroom = Classroom::findOrFail($validated['class_id']);
        if ($classroom->user_id !== Auth::id()) {
            return redirect()->back()->with('error', 'Unauthorized action.');
        }
        
        $material = new Material();
        $material->title = $validated['title'];
        $material->description = $validated['description'];
        $material->class_id = $validated['class_id'];
        $material->uploaded_at = now();
        
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->store('materials', 'public');
            $material->file_path = $path;
        }
        
        $material->save();
        
        return redirect()->back();
    }

    /**
     * Update the specified material in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Material  $material
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Material $material)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file' => 'nullable|file|max:10240', // 10MB max
            'class_id' => 'required|exists:classrooms,id',
        ]);
        
        // Check if user is the owner of the classroom
        $classroom = Classroom::findOrFail($validated['class_id']);
        if ($classroom->user_id !== Auth::id()) {
            return redirect()->back()->with('error', 'Unauthorized action.');
        }
        
        $material->title = $validated['title'];
        $material->description = $validated['description'];
        
        if ($request->hasFile('file')) {
            // Delete old file if exists
            if ($material->file_path) {
                Storage::disk('public')->delete($material->file_path);
            }
            
            $file = $request->file('file');
            $path = $file->store('materials', 'public');
            $material->file_path = $path;
        }
        
        $material->save();
        
        return redirect()->back();
    }

    /**
     * Remove the specified material from storage.
     *
     * @param  \App\Models\Material  $material
     * @return \Illuminate\Http\Response
     */
    public function destroy(Material $material)
    {
        // Check if user is the owner of the classroom
        $classroom = Classroom::findOrFail($material->class_id);
        if ($classroom->user_id !== Auth::id()) {
            return redirect()->back()->with('error', 'Unauthorized action.');
        }
        
        // Delete file if exists
        if ($material->file_path) {
            Storage::disk('public')->delete($material->file_path);
        }
        
        $material->delete();
        
        return redirect()->back();
    }
}