import useSWRImmutable from "swr/immutable";

import { fetcher } from "@utils/swr.fetcher";

const useUser = (username: string, shouldFetch: boolean = true) => {
  const { data, error, isLoading } = useSWRImmutable(
    shouldFetch ? `/users/${username}` : null,
    fetcher,
    // {
    //   revalidateIfStale: false,
    //   revalidateOnFocus: false,
    //   revalidateOnReconnect: false,
    //   refreshWhenOffline: false,
    // }
  );

  return {
    data,
    isLoading: isLoading,
    error: error,
  };
};

export default useUser;
