<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\Classroom;
use App\Models\Material;
use App\Models\Member;
use App\Models\Submission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ClassroomController extends Controller
{
    /**
     * Display a listing of the classrooms.
     */
    public function index(): Response
    {
        $user = Auth::user();
        
        $ownedClassrooms = $user->classrooms()->latest()->get();
        
        $joinedClassrooms = Classroom::whereHas('members', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->latest()->get();
        
        return Inertia::render('Dashboard', [
            'ownedClassrooms' => $ownedClassrooms,
            'joinedClassrooms' => $joinedClassrooms,
        ]);
    }

    /**
     * Show the form for creating a new classroom.
     */
    public function create(): Response
    {
        return Inertia::render('Classroom/Create');
    }

    /**
     * Store a newly created classroom in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'classname' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $classroom = Classroom::create([
            'user_id' => Auth::id(),
            'classname' => $request->classname,
            'description' => $request->description,
        ]);

        return redirect()->route('dashboard')->with('message', 'Classroom created successfully.');
    }

    /**
     * Display the specified classroom.
     */
    public function show(Classroom $classroom)
    {
        try {
            $this->authorize('view', $classroom);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return redirect()->route('dashboard')->with('error', 'You are not a member of this classroom.');
        }
        
        $classroom->load('members.user');

        // Tarik semua materi dan tugas berdasarkan class_id
        // $materials = Material::where('class_id', $classroom->id)->get();
        // $assignments = Assignment::where('class_id', $classroom->id)->get();

        // Tarik semua submission untuk tugas di dalam kelas ini
        // $submissions = Submission::with('user')
        //     ->whereIn('assignment_id', $assignments->pluck('id'))
        //     ->get();

        // Load assignments
        $assignments = $classroom->assignments()->orderBy('created_at', 'desc')->get();

        // Load submissions (if owner)
        $submissions = [];
        if ($classroom->user_id === Auth::id()) {
            $submissions = Submission::whereIn('assignment_id', $assignments->pluck('id'))
                ->with('users')
                ->get();
        } else {
            // Only load this student's submissions
            $submissions = Submission::whereIn('assignment_id', $assignments->pluck('id'))
                ->where('student_id', Auth::id())
                ->with('users')
                ->get();
        }

        // Load Stream
        $announcements = $classroom->announcements()
        ->select('id', 'title', 'content', 'file_path', 'created_at', DB::raw('NULL as due_date'), DB::raw("'announcement' as type"))
        ->orderBy('created_at', 'desc')
        ->get();

        $assignments = $classroom->assignments()
        ->select('id', 'title', DB::raw('description as content'), 'file_path', 'created_at', 'due_date', DB::raw("'assignment' as type"))
        ->orderBy('due_date', 'desc')
        ->get();

        $materials = $classroom->materials()
        ->select('id', 'title', DB::raw('description as content'), 'file_path', 'created_at', DB::raw('NULL as due_date'), DB::raw("'material' as type"))
        ->orderBy('created_at', 'desc')
        ->get();

        $streams = $announcements->concat($assignments)->concat($materials);

        $streams = $streams->sortByDesc('created_at')->values();

        return Inertia::render('Classroom/Show', [
            'classroom' => $classroom,
            'streams' => $streams,
            'announcements' => $classroom->announcements()->orderBy('created_at', 'desc')->get(),
            'materials' => $classroom->materials()->orderBy('created_at', 'desc')->get(),
            'assignments' => $classroom->assignments()->orderBy('created_at', 'desc')->get(),
            'submissions' => $submissions,
            'members' => $classroom->members()->with('user')->get(),
        ]);
    }

    /**
     * Show the form for editing the specified classroom.
     */
    public function edit(Classroom $classroom): Response
    {
        $this->authorize('update', $classroom);
        
        return Inertia::render('Classroom/Edit', [
            'classroom' => $classroom,
        ]);
    }

    /**
     * Update the specified classroom in storage.
     */
    public function update(Request $request, Classroom $classroom)
    {
        $this->authorize('update', $classroom);
        
        $request->validate([
            'classname' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $classroom->update([
            'classname' => $request->classname,
            'description' => $request->description,
        ]);

        return redirect()->route('classrooms.show', $classroom)->with('message', 'Classroom updated successfully.');
    }

    /**
     * Remove the specified classroom from storage.
     */
    public function destroy(Classroom $classroom)
    {
        $this->authorize('delete', $classroom);
        
        $classroom->delete();

        return redirect()->route('dashboard')->with('message', 'Classroom deleted successfully.');
    }

    /**
     * Join a classroom using a class code.
     */
    public function join(Request $request)
    {
        $request->validate([
            'classcode' => 'required|string|exists:classrooms,classcode',
        ]);

        $classroom = Classroom::where('classcode', $request->classcode)->first();
        
        $existingMember = Member::where('class_id', $classroom->id)
            ->where('user_id', Auth::id())
            ->exists();
            
        if ($existingMember) {
            return redirect()->route('dashboard')->with('message', 'You are already a member of this classroom.');
        }
        
        Member::create([
            'class_id' => $classroom->id,
            'user_id' => Auth::id(),
            'joined_at' => now(),
        ]);

        return redirect()->route('dashboard')->with('message', 'Successfully joined the classroom.');
    }

    /**
     * Leave a classroom.
     */
    public function leave(Classroom $classroom)
    {
        Member::where('class_id', $classroom->id)
            ->where('user_id', Auth::id())
            ->delete();

        return redirect()->route('dashboard')->with('message', 'Successfully left the classroom.');
    }

    /**
     * Kick a classroom member.
     */
    public function kickMember(Classroom $classroom, Member $member)
    {
        $this->authorize('update', $classroom);

        if ($member->class_id !== $classroom->id) {
            if (request()->wantsJson()) {
                return response()->json(['error' => 'Invalid request'], 403);
            }
            return redirect()->route('classrooms.show', $classroom)->with('error', 'Invalid request');
        }

        try {
            $member->delete();

            if (request()->wantsJson()) {
                return response()->json(['success' => 'Member removed successfully']);
            }

            return redirect()->route('classrooms.show', $classroom)->with('success', 'Member removed successfully');
        } catch (\Exception $e) {
            if (request()->wantsJson()) {
                return response()->json(['error' => 'Failed to remove member'], 500);
            }

            return redirect()->route('classrooms.show', $classroom)->with('error', 'Failed to remove member');
        }
    }
}