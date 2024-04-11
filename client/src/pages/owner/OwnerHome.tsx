import styled from 'styled-components';
import { useGetOwnerHomeList } from '../../features/owner/hooks/useGetOwnerHomeList';
import Spinner from '../../components/loaders/Spinner';
import ErrorPage from '../ErrorPage';
import { Link } from 'react-router-dom';
import { screenWidths } from '../../providers/ScreenProvider';

const StyledOwnerHome = styled.div`
  display: flex;
  flex-direction: column;

  .content {
    flex: 1 0 auto;
    padding: 1rem 5%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  h1 {
    text-align: center;
  }

  .owner-home-table {
    margin: 0 auto;
    border-collapse: collapse;
    border: 1px solid black;

    .home-image {
      display: block;
      height: 100px;
      aspect-ratio: 3/2;
      margin: 0;
      object-fit: cover;
    }

    tr.rejected {
      border: 4px solid red;

      a {
        color: red;
      }
    }

    td,
    th {
      /* border: 1px solid black; */
    }

    th {
      padding: 1rem;
      color: white;
      background-color: black;
    }

    td {
      text-align: center;
      padding: 1rem;
      border-bottom: 1px solid black;
    }

    td:nth-child(2),
    td:nth-child(3) {
      word-break: break-all;
    }

    a {
      color: black;
    }
  }

  tr:nth-child(odd) {
    /* background-color: lightgray; */
  }

  @media (max-width: ${screenWidths.phone}px) {
    --td-padding: 1.5rem;

    .owner-home-table {
      border: none;

      tbody,
      tr,
      th,
      td {
        display: block;
        padding: 0;
      }

      tr {
        font-size: 1.2rem;
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
      }

      tr:not(:last-child) {
        padding-bottom: var(--td-padding);
        border-bottom: 1px solid black;
      }

      tr:not(:first-child) {
        padding-top: var(--td-padding);
      }

      th {
        display: none;
      }

      td:first-child {
        display: none;
      }

      td {
        padding-inline: 1rem;
        text-align: left;
        border-bottom: none;
      }

      .home-image {
        height: auto;
        width: 100%;
        aspect-ratio: 1;
        border-radius: 15px;
      }
    }
  }
`;

const OwnerHome: React.FC = () => {
  const { data, isLoading, isError, error } = useGetOwnerHomeList();

  const approved = data?.approved;
  const pending = data?.pending;
  const rejected = data?.rejected;

  return (
    <StyledOwnerHome>
      <div className="content">
        <h1>Your homes</h1>
        {isLoading ? (
          <Spinner />
        ) : isError || !data ? (
          <ErrorPage error={error} />
        ) : (!approved || approved.length === 0) && !pending && !rejected ? (
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
              {rejected && (
                <tr className="rejected">
                  <td>1</td>
                  <td>
                    <img
                      className="home-image"
                      src={rejected.main_image}
                      alt=""
                    />
                  </td>
                  <td>{rejected.name}</td>
                  <td>{rejected.address}</td>
                  <td>
                    <Link to={`/details/${rejected.id}`}>
                      Rejected. See details.
                    </Link>
                  </td>
                </tr>
              )}
              {approved &&
                approved.map((home, index) => (
                  <tr key={home.id}>
                    <td>
                      {index + 1 + (rejected ? 1 : 0) + (pending ? 1 : 0)}
                    </td>
                    <td>
                      <img
                        className="home-image"
                        src={home.main_image}
                        alt=""
                      />
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
      </div>
    </StyledOwnerHome>
  );
};

export default OwnerHome;
