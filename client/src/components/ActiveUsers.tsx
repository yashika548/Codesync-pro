interface ActiveUser {
  socketId: string;
  userId: string;
  name: string;
}

interface ActiveUsersProps {
  users: ActiveUser[];
  currentUserId?: string;
}

const ActiveUsers = ({
  users,
  currentUserId,
}: ActiveUsersProps) => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h2 style={{ margin: 0 }}>
          👥 Active Users
        </h2>

        <span>{users.length}</span>
      </div>

      {users.length === 0 ? (
        <p>No active users</p>
      ) : (
        users.map((activeUser) => (
          <div
            key={activeUser.socketId}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 0",
            }}
          >
            <span>🟢</span>

            <div>
              <div>{activeUser.name}</div>

              <small>
                {activeUser.userId === currentUserId
                  ? "You"
                  : "Online"}
              </small>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ActiveUsers;