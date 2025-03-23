<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubmissionComment extends Model
{
    use HasFactory;

    protected $fillable = [
        'submission_id',
        'user_id',
        'message',
        'is_read',
        'is_system'
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'is_system' => 'boolean',
    ];

    /**
     * Get the submission this comment belongs to
     */
    public function submission()
    {
        return $this->belongsTo(Submission::class);
    }

    /**
     * Get the user who created this comment
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}