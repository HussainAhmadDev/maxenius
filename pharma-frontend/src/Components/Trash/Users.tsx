import * as React from "react";
import UsersTable from "../Admin/Users/UsersTable";
import UserFilters from "../Admin/Users/UserFilters";
import {
  QueryPagination,
  UserPageFilters,
  UserQueryFilters
} from "Interfaces/QueryFilters";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "Hooks/useDebounce";
import { useUsers } from "Hooks/useUsers";

type PartialQueryPagination = Partial<QueryPagination> & { [key: string]: string };

const UsersTrash: React.FC = () => {
  const [queryFilters, setQueryFilters] = React.useState<UserQueryFilters>({
    count: "10"
  });
  useDebounce(queryFilters, 800);

  const [searchParams, setSearchParams] = useSearchParams();
  const debouncedParams = useDebounce(searchParams, 800);

  const { data: users, isLoading, refetch } = useUsers(debouncedParams);

  const handleUserFilters = (search: Partial<UserPageFilters>) => {
    setQueryFilters({ ...search, page: "1", count: "10" });
  };

  const handlePaginationChange = (pagination: PartialQueryPagination) => {
    const paginationKey = Object.keys(pagination)[0];

    if (!paginationKey) {
      return;
    }

    const newParams = new URLSearchParams(searchParams);

    if (pagination[paginationKey]) {
      newParams.set(paginationKey, pagination[paginationKey].toString());
    } else {
      newParams.delete(paginationKey);
    }

    setSearchParams(newParams);
  };

  return (
    <div>
      <UserFilters onSearch={refetch} handleUserFilters={handleUserFilters} />
      <br />
      <UsersTable
        isLoading={isLoading}
        users={users}
        handlePagination={handlePaginationChange}
      />
    </div>
  );
};

export default UsersTrash;
