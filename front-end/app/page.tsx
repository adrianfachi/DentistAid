import Body from "./_components/Body";
import SearchUser from "./_components/SearchUser";

export default function users() {
  return (
    <Body activeNavBar="users">
      <div>
        <h1 className="text-2xl font-semibold">Dra. Natália Rossoni</h1>
        <SearchUser />

      </div>
    </Body>
  );
}
