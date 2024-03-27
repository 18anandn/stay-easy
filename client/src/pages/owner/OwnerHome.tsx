import styled from 'styled-components';
import { useGetOwnerHomeList } from '../../features/owner/hooks/useGetOwnerHomeList';
import Spinner from '../../components/loaders/Spinner';
import ErrorPage from '../ErrorPage';
import { Link } from 'react-router-dom';

const StyledOwnerHome = styled.div`
  padding: 2rem 5%;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  h1 {
    text-align: center;
  }

  .owner-home-table {
    margin: 0 auto;
    border-collapse: collapse;
    border: 1px solid black;

    .home-image {
      display: block;
      width: 150px;
      height: 100px;
      margin: 0;
      object-fit: cover;
    }

    td,
    th {
      /* border: 1px solid black; */
    }

    thead {
      th {
        padding: 1rem;
        color: white;
        background-color: black;
      }
    }

    tbody {
      tr {
        td {
          text-align: center;
          padding: 1rem;
          border-bottom: 1px solid black;
        }

        td:nth-child(2) {
        }

        a {
          color: black;
        }
      }

      tr:nth-child(odd) {
        /* background-color: lightgray; */
      }
    }
  }
`;

const OwnerHome: React.FC = () => {
  const { data, isLoading, isError, error } = useGetOwnerHomeList();

  return (
    <StyledOwnerHome>
      <h1>Your homes</h1>
      {isLoading ? (
        <Spinner />
      ) : isError || !data ? (
        <ErrorPage error={error} />
      ) : data.length === 0 ? (
        <p>No homes owned</p>
      ) : (
        <table className="owner-home-table">
          <thead>
            <tr>
              <th className="number">No.</th>
              <th className="image">Image</th>
              <th className="name">Name</th>
              <th className="location">Location</th>
              <th className="dashboard-link">Link</th>
            </tr>
          </thead>
          <tbody>
            {data.map((home, index) => (
              <tr key={home.id}>
                <td>{index + 1}</td>
                <td>
                  <img className="home-image" src={home.main_image} alt="" />
                </td>
                <td>{home.name}</td>
                <td>
                  {home.city}, {home.country}
                </td>
                <td>
                  <Link to={`/${home.id}`}>Go to dashboard</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </StyledOwnerHome>
  );
};

export default OwnerHome;
