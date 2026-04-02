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
            <th>Name</th>
            <th>Street</th>
            <th>State</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.status === "ok" &&
            data.properties.map((prop) => (
              <tr key={prop.pid}>
                <td>{prop.name}</td>
                <td>{prop.street}</td>
                <td>{prop.state}</td>
                <td>
                  <Link href="/host/edit">Edit</Link>
                  <Link href={"/property/" + prop.pid}> View</Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </section>
  );
}
