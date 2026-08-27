import * as React from "react";
import Layout from "Components/layout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { NavBar } from "Components/Navbar";
import UserFilters from "Components/Admin/Users/UserFilters";
import { UserPageFilters, QueryPagination } from "Interfaces/QueryFilters";
import UsersTable from "Components/Admin/Users/UsersTable";
import Button from "Components/Button";
import MuiIcon from "Components/icons/MuiIcons";
import { useDebounce } from "Hooks/useDebounce";
import { useUsers } from "Hooks/useUsers";
type PartialQueryPagination = Partial<QueryPagination> & { [key: string]: string };

export const AdminUsers: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const debouncedParams = useDebounce(searchParams, 800);

  const { data: users, isLoading, refetch } = useUsers(debouncedParams);

  const handleUserFilters = (search: Partial<UserPageFilters>) => {
    // setQueryFilters({ ...search, page: "1", count: "50" });
  };

  const handlePaginationChange = (pagination: PartialQueryPagination) => {
    const paginationKey = Object.keys(pagination)[0];

    if (!paginationKey) {
      return;
    } else {
      const newParams = new URLSearchParams(searchParams);

      if (pagination[paginationKey]) {
        newParams.set(paginationKey, pagination[paginationKey].toString());
      } else {
        newParams.delete(paginationKey);
      }

      setSearchParams(newParams);
    }
  };

  return (
    <Layout title="Users">
      <NavBar pageTitle="Users">
        <Button
          onClick={() => navigate("/admin/user/create")}
          icon={<MuiIcon icon="add" />}
          variant="contained"
          text="Create User"
        />
      </NavBar>
      <div style={{ padding: 30 }}>
        <UserFilters onSearch={refetch} handleUserFilters={handleUserFilters} />
        <br />
        <UsersTable
          isLoading={isLoading}
          users={users}
          handlePagination={handlePaginationChange}
        />
      </div>
    </Layout>
  );
};

export default AdminUsers;
