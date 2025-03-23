<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'class_id',
        'user_id',
        'file_path',
        'file_name',
    ];

    /**
     * Get the classroom that owns the announcement.
     */
    public function classroom()
    {
        return $this->belongsTo(Classroom::class);
    }

    /**
     * Get the user that created the announcement.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}