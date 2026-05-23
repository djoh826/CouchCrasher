import { UserPropertiesResponse } from "@/lib/apiEndpoints";
import "./UserPropertyForm.css";
import Link from "next/link";

export default function UserPropertyForm({
  data,
}: {
  data: UserPropertiesResponse;
}) {
  if (data.status === "empty") return <div>No properties found.</div>;
  if (data.status === "not_host") return <div>You are not a host.</div>;
  if (data.status === "error") return <div>Error: {data.error}</div>;

  return (
    <section className="user-properties">
      <table>
        <thead>
          <tr>
            <th>Thumbnail</th>
            <th>Name</th>
            <th>Street</th>
            <th>City</th>
            <th>State</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.properties.map((prop) => {
            const thumbnail = prop.propertyphotos?.[0]?.thumbnailurl || null;

            const imageUrl = thumbnail ? `https://${thumbnail}` : null;

            return (
              <tr key={prop.pid}>
                <td>
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={prop.name}
                      className="property-thumbnail"
                    />
                  ) : (
                    <div className="thumbnail-placeholder">No image</div>
                  )}
                </td>

                <td>{prop.name}</td>

                <td>{prop.street}</td>

                <td>{prop.city}</td>

                <td>{prop.state}</td>

                <td>
                  <div className="actions">
                    <Link href="/host/edit">Edit</Link>

                    <Link href={"/property/" + prop.pid}>View</Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
