<?php

namespace App\Http\Controllers;

use App\Models\Grade;
use App\Models\Assignment;
use Illuminate\Http\Request;

class GradeController extends Controller
{
    public function index(Request $request)
    {
        $assignmentId = $request->query('assignment_id');
        
        $grades = Grade::where('assignment_id', $assignmentId)
            ->get();
        
        return response()->json($grades);
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'assignment_id' => 'required|exists:assignments,id',
            'user_id' => 'required|exists:users,id',
            'score' => 'nullable|numeric|min:0|max:100',
            'comment' => 'nullable|string',
        ]);
        
        $grade = Grade::updateOrCreate(
            [
                'assignment_id' => $validated['assignment_id'],
                'user_id' => $validated['user_id'],
            ],
            [
                'score' => $validated['score'],
                'comment' => $validated['comment'] ?? null,
            ]
        );
        
        return response()->json($grade);
    }
    
    public function storeBatch(Request $request)
    {
        $request->validate([
            'grades' => 'required|array',
            'grades.*.assignment_id' => 'required|exists:assignments,id',
            'grades.*.user_id' => 'required|exists:users,id',
            'grades.*.score' => 'nullable|numeric|min:0|max:100',
            'grades.*.comment' => 'nullable|string',
        ]);
        
        $grades = $request->input('grades');
        
        foreach ($grades as $gradeData) {
            Grade::updateOrCreate(
                [
                    'assignment_id' => $gradeData['assignment_id'],
                    'user_id' => $gradeData['user_id'],
                ],
                [
                    'score' => $gradeData['score'],
                    'comment' => $gradeData['comment'] ?? null,
                ]
            );
        }
        
        return response()->json(['message' => 'Grades saved successfully']);
    }
}