import type { Status } from "../enums/Status"

export interface Avatar {
    id: string
    collectionId: string
    collectionName: string
    front_view: string
    side_view: string
    height: number
    shoulder: number
    torso: number
    side_depth: number
    unrigged_glb: string
    rigged_glb: string
    status: Status 
    created: Date
    updated: Date
  }
  