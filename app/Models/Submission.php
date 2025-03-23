<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    use HasFactory;

    protected $fillable = [
        'assignment_id',
        'student_id',
        'file_path',
        'score',
        'feedback',
        'status',
        'submitted_at'
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
    ];

    public function assignment()
    {
        return $this->belongsTo(Assignment::class, 'assignment_id');
    }

    public function users()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    /**
     * Get the comments for this submission
     */
    public function comments()
    {
        return $this->hasMany(SubmissionComment::class);
    }
}