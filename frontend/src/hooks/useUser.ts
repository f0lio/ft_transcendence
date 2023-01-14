import useSWR from "swr";

import { fetcher } from "@utils/swr.fetcher";

const useUser = (username: string, shouldFetch: boolean = true) => {
  const { data, error, isLoading, isValidating } = useSWR(
    shouldFetch ? `/users/${username}` : null,
    fetcher
  );

  return {
    data,
    isLoading: isLoading,
    isValidating: isValidating,
    error: error,
  };
};

export default useUser;
