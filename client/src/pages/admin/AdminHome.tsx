import styled from 'styled-components';
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic.css';
import Select from 'react-select';

import { format } from 'date-fns';
import { useGetHomeList } from '../../features/admin/hooks/useGetHomeList';
import { Link, useSearchParams } from 'react-router-dom';
import { searchParamsToObjParams } from '../../features/admin/services/getHomeList';
import Spinner from '../../components/loaders/Spinner';
import ErrorPage from '../ErrorPage';
import { VERIFICATION_OPTIONS } from '../../features/admin/services/updateHomeData';
import { DATETIME_FORMAT_TEXT } from '../../data/constants';

const StyledAdminHome = styled.div`
  padding: 2rem;

  .verify-select {
    width: max-content;
    margin-bottom: 2rem;
  }

  .home-list {
    /* margin-left: auto;
    margin-right: auto; */
    margin-bottom: 1rem;
    border-collapse: collapse;

    td {
      border: 1px solid black;
      padding: 1rem;
    }

    thead {
      td {
        text-align: center;
      }
    }

    tbody {
      .home-name {
        a {
          color: black;
        }
      }

      .owner-name {
        text-align: center;
      }

      .created {
        text-align: end;
      }
    }
  }
`;

const AdminHome: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const objParams = searchParamsToObjParams(searchParams);
  const { data, isLoading, isError, error } = useGetHomeList(objParams);

  return (
    <StyledAdminHome>
      {isLoading && <Spinner />}
      {isError && <ErrorPage error={error} />}
      {!isLoading && data && (
        <>
          <Select
            className="verify-select"
            value={
              VERIFICATION_OPTIONS.find(
                (val) => val.value === objParams.verification_status,
              ) ?? null
            }
            options={VERIFICATION_OPTIONS}
            isClearable
            onChange={(val) => {
              if (!val) {
                searchParams.delete('verification_status');
              } else {
                searchParams.set('verification_status', `${val.value}`);
              }
              setSearchParams(searchParams);
            }}
          />
          <table className="home-list">
            <thead>
              <tr>
                <th>Home name</th>
                <th>Owner name</th>
                <th>Created at</th>
              </tr>
            </thead>
            <tbody>
              {data.homeList.map((home) => (
                <tr key={home.id}>
                  <td className="home-name">
                    <Link to={`/home/${home.id}`}>{home.name}</Link>
                  </td>
                  <td className="owner-name">{home.user}</td>
                  <td className="created">
                    {format(new Date(home.created), DATETIME_FORMAT_TEXT)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.totalPages > 1 && (
            <div className="pagination-container">
              <ResponsivePagination
                total={data.totalPages}
                current={objParams.page}
                onPageChange={(page) => {
                  searchParams.set('page', page.toString());
                  setSearchParams(searchParams);
                }}
              />
            </div>
          )}
        </>
      )}
    </StyledAdminHome>
  );
};

export default AdminHome;
