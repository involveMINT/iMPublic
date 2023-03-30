import { IsBoolean, IsString } from 'class-validator';


export abstract class RecentActivityPostDto {
  /**
   * Take in POI to create Post.
   * 
   * Service Logic:
   * Enabled => True
   * DateCreated => now()
   * ID => UUID
   * Comments => None yet.
   * LikesCount => 0.
   * Likes => None yet. 
   * User => Fetched via auth + perform checks
   * Insert Post into the database.
   */
  @IsBoolean()
  recent?: boolean;
}

export abstract class CreateActivityPostDto {
  /**
   * Take in POI to create Post.
   * 
   * Service Logic:
   * Enabled => True
   * DateCreated => now()
   * ID => UUID
   * Comments => None yet.
   * LikesCount => 0.
   * Likes => None yet. 
   * User => Fetched via auth + perform checks
   * Insert Post into the database.
   */
  @IsString()
  poiId!: string;
}

export abstract class DisableActivityPostDto {
  /**
   * Take in a Post ID to disable it.
   * 
   * Service Logic:
   * Enabled => False
   * User auth done by service + perform checks.
   */
  @IsString()
  postId!: string;
}

export abstract class EnableActivityPostDto {
  /**
   * Take in a Post ID to enable it.
   * 
   * Service Logic:
   * Enabled => True
   * User auth done by service + perform checks.
   */
  @IsString()
  postId!: string;
}

export abstract class LikeActivityPostDto {
  /**
   * Take in a Post ID and attach a like to it.
   * 
   * Service Logic:
   * Fetch the userId based on auth token + perform checks
   * Create like record
   * Increment likeCounter
   */
  @IsString()
  postId!: string;
}

export abstract class UnlikeActivityPostDto {
  /**
   * Take in a Post ID and remove a like from it.
   * 
   * Service Logic: 
   * Fetch the userId based on auth token + perform checks
   * Remove the like record (or mark as hidden)
   * Decrement likeCounter
   */
  @IsString()
  postId!: string;
}
