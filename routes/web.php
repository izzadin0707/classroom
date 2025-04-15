<?php

use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\ClassroomController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SubmissionController;
use Illuminate\Foundation\Application;
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

Route::middleware('auth')->group(function () {
    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
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

    // Announcement
    Route::post('/announcements', [AnnouncementController::class, 'store'])->name('announcements.store');
    Route::put('/announcements/{id}', [AnnouncementController::class, 'update'])->name('announcements.update');
    Route::post('/announcements/{id}', [AnnouncementController::class, 'update'])->name('announcements.update');
    Route::delete('/announcements/{id}', [AnnouncementController::class, 'destroy'])->name('announcements.destroy');

    // Material
    Route::post('/materials', [MaterialController::class, 'store'])->name('materials.store');
    Route::put('/materials/{material}', [MaterialController::class, 'update'])->name('materials.update');
    Route::delete('/materials/{material}', [MaterialController::class, 'destroy'])->name('materials.destroy');

    // Assignment
    Route::post('/assignments', [App\Http\Controllers\AssignmentController::class, 'store'])->name('assignments.store');
    Route::put('/assignments/{assignment}', [App\Http\Controllers\AssignmentController::class, 'update'])->name('assignments.update');
    Route::post('/assignments/{assignment}', [App\Http\Controllers\AssignmentController::class, 'update'])->name('assignments.update');
    Route::delete('/assignments/{assignment}', [App\Http\Controllers\AssignmentController::class, 'destroy'])->name('assignments.destroy');

    // Submission
    Route::post('/assignments/{assignment}/submissions/upload', [SubmissionController::class, 'upload'])->name('submissions.upload');
    Route::get('/assignments/{assignment}/submissions', [SubmissionController::class, 'list'])->name('submissions.list');
    Route::delete('/submissions/{submission}', [SubmissionController::class, 'destroy'])->name('submissions.destroy');

    // Submission Comment
    Route::patch('/submissions/{id}', [SubmissionController::class, 'update']);
    Route::get('/submissions/{id}/messages', [SubmissionController::class, 'getMessages']);
    Route::post('/submissions/{id}/messages', [SubmissionController::class, 'storeMessage']);

    // Grade
    Route::get('/grades', [GradeController::class, 'index'])->name('grades.index');
    Route::post('/grades', [GradeController::class, 'store'])->name('grades.store');
    Route::post('/grades/batch', [GradeController::class, 'storeBatch'])->name('grades.store-batch');
});

require __DIR__.'/auth.php';
