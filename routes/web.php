<?php

use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\ClassroomController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SubmissionController;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard', [
//         'class' => User::find(Auth::id())->class
//     ]);
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Classroom
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Classroom routes
    Route::get('/dashboard', [ClassroomController::class, 'index'])->name('dashboard');
    Route::resource('classrooms', ClassroomController::class);
    
    // Join classroom route
    Route::post('/classrooms/join', [ClassroomController::class, 'join'])->name('classrooms.join');
    
    // Leave classroom route
    Route::delete('/classrooms/{classroom}/leave', [ClassroomController::class, 'leave'])->name('classrooms.leave');

    // Kick classroom member
    Route::delete('/classrooms/{classroom}/members/{member}', [ClassroomController::class, 'kickMember'])->name('classrooms.kick');

    // Material
    Route::post('/materials', [MaterialController::class, 'store'])->name('materials.store');
    Route::put('/materials/{material}', [MaterialController::class, 'update'])->name('materials.update');
    Route::delete('/materials/{material}', [MaterialController::class, 'destroy'])->name('materials.destroy');

    // Assignment
    Route::post('/assignments', [App\Http\Controllers\AssignmentController::class, 'store'])->name('assignments.store');
    Route::put('/assignments/{assignment}', [App\Http\Controllers\AssignmentController::class, 'update'])->name('assignments.update');
    Route::delete('/assignments/{assignment}', [App\Http\Controllers\AssignmentController::class, 'destroy'])->name('assignments.destroy');

    // Submission routes
    Route::post('/assignments/{assignment}/submissions/upload', [SubmissionController::class, 'upload'])->name('submissions.upload');
    Route::get('/assignments/{assignment}/submissions', [SubmissionController::class, 'list'])->name('submissions.list');
    Route::delete('/submissions/{submission}', [SubmissionController::class, 'destroy'])->name('submissions.destroy');
});

require __DIR__.'/auth.php';
