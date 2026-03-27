import { UserPropertiesResponse } from "@/lib/apiEndpoints";
import "./UserPropertyForm.css";

export default function UserPropertyForm({
  data,
}: {
  data: UserPropertiesResponse;
}) {
  return (
    <section className="user-properties">
      {data.status === "ok" &&
        data.properties.map((prop) => (
          <div className="results-row" key={prop.pid}>
            <div className="name">{prop.name}</div>
            <div className="address">{prop.street}</div>
            <div className="state">{prop.state}</div>
            <div className="country">{prop.country}</div>
          </div>
        ))}

      {data.status === "empty" && <div>No properties found.</div>}
      {data.status === "not_host" && <div>You are not a host.</div>}
      {data.status === "error" && <div>Error: {data.error}</div>}
    </section>
  );
}
