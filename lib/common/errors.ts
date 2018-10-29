// NEVER INSERT ERRORS IN-BETWEEN OTHER VALUES IN THE SAME GROUP! ONLY APPEND ERRORS TO THE GROUP THEY BELONG!
export const enum ErrorCodes {
    Success = 0,
    UnknownError = 1,
    // Range 1 - 99 is saved for general errors
    // e.g. DB connection errors, etc

    // Codes regarding groups are in the range 100-199
    NoGroupsExist = 100,                // List of groups is empty
    InvalidGroupID,
    GroupIsFull,
    InvalidInviteID,
    ErrorCreatingGroup,                 // Consider breaking this one up into more specific sub-errors

    // Codes regarding users are in the range 200 - 299
    NoUsersExist = 200,
    InvalidUserID,
    UserAlreadyInThisGroup,
    UserAlreadyInOtherGroup,
    UserDoesNotMeetGroupRequirements,   // Trying to join a group which you do not meet the requirements for
    ErrorCreatingUser,
}