<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Classroom extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'classname',
        'description',
        'classcode',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($classroom) {
            // Generate a unique class code if not provided
            if (!$classroom->classcode) {
                $classroom->classcode = Str::random(8);
            }
        });
    }

    /**
     * Get the user that owns the classroom.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the members for the classroom.
     */
    public function members(): HasMany
    {
        return $this->hasMany(Member::class, 'class_id');
    }

    /**
     * Get the materials for the classroom.
     */
    public function materials(): HasMany
    {
        return $this->hasMany(Material::class, 'class_id');
    }

    /**
     * Get the assignments for the classroom.
     */
    public function assignments(): HasMany
    {
        return $this->hasMany(Assignment::class, 'class_id');
    }
}