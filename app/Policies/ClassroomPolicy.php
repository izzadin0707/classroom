<?php

namespace App\Policies;

use App\Models\Classroom;
use App\Models\User;
use App\Models\Member;
use Illuminate\Auth\Access\HandlesAuthorization;

class ClassroomPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Classroom $classroom): bool
    {
        // User can view if they're the owner
        if ($classroom->user_id === $user->id) {
            return true;
        }
        
        // User can view if they're a member
        return Member::where('class_id', $classroom->id)
            ->where('user_id', $user->id)
            ->exists();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Classroom $classroom): bool
    {
        // Only the owner can update the classroom
        return $classroom->user_id === $user->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Classroom $classroom): bool
    {
        // Only the owner can delete the classroom
        return $classroom->user_id === $user->id;
    }
}