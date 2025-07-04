import { useEffect, useState } from "react";
import { usePocketBase } from "../context/PocketBaseContext";
import { useAuth } from "../context/AuthContext";
import { CollectionNames } from "../enums/CollectionNames";

export const useAcceptedDataPrivacy = () => {
    const [accepted, setAccepted] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    const pb = usePocketBase();
    const { userId } = useAuth();
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          setError(null);
          const result = await pb
            .collection(CollectionNames.DATA_PRIVACY_CONSENT)
            .getFirstListItem(`user = "${userId}"`);
  
          setAccepted(result.accepted_data_privacy || false);
        } catch (err: any) {
          if (err.status === 404) {
            setAccepted(false); // Not accepted yet
          } else {
            console.error("Unexpected error:", err);
            setError("Failed to fetch data privacy status");
          }
        } finally {
          setLoading(false);
        }
      };
  
      if (userId) fetchData();
    }, [pb, userId]);

    const addAcceptance = async () => {
      if (!userId) {
        setError("User not authenticated");
        return false;
      }

      setActionLoading(true);
      setError(null);

      try {
        const data = {
          user: userId,
          accepted_data_privacy: true
        };

        await pb.collection(CollectionNames.DATA_PRIVACY_CONSENT).create(data);
        setAccepted(true);
        return true;
      } catch (err: any) {
        console.error("Error adding acceptance:", err);
        setError("Failed to save acceptance");
        return false;
      } finally {
        setActionLoading(false);
      }
    };

    const deleteAcceptance = async () => {
      if (!userId) {
        setError("User not authenticated");
        return false;
      }

      setActionLoading(true);
      setError(null);

      try {
        // First find the record
        const record = await pb
          .collection(CollectionNames.DATA_PRIVACY_CONSENT)
          .getFirstListItem(`user = "${userId}"`);

        // Delete the record
        await pb.collection(CollectionNames.DATA_PRIVACY_CONSENT).delete(record.id);
        setAccepted(false);
        return true;
      } catch (err: any) {
        if (err.status === 404) {
          // Record doesn't exist, consider it already deleted
          setAccepted(false);
          return true;
        }
        console.error("Error deleting acceptance:", err);
        setError("Failed to delete acceptance");
        return false;
      } finally {
        setActionLoading(false);
      }
    };

    const refetch = async () => {
      if (!userId) return;

      setLoading(true);
      setError(null);

      try {
        await pb
          .collection(CollectionNames.DATA_PRIVACY_CONSENT)
          .getFirstListItem(`user = "${userId}"`);

        setAccepted(true);
      } catch (err: any) {
        if (err.status === 404) {
          setAccepted(false);
        } else {
          console.error("Unexpected error:", err);
          setError("Failed to fetch data privacy status");
        }
      } finally {
        setLoading(false);
      }
    };
  
    return { 
      accepted, 
      loading, 
      actionLoading, 
      error, 
      addAcceptance, 
      deleteAcceptance, 
      refetch 
    };
};