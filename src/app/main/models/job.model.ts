import {User} from "../../auth/models/user.model";

export interface Job{
  id?: number;
  title: string;
  description: string;
  type: string;
  category: string;
  active: boolean;
  likedBy?: User[];
  candidates?: User[];
  acceptedCandidate?: User;
  owner:User;
}
