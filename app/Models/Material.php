<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'file_path',
        'class_id',
        'uploaded_at'
    ];

    /**
     * Get the classroom that owns the material.
     */
    public function classroom()
    {
        return $this->belongsTo(Classroom::class, 'class_id');
    }
}