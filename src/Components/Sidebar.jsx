import  { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  FaHome, 
  FaTags, 
  FaBolt, 
  FaCog,
  FaSearch, 
  FaUserFriends, 
  FaBookmark,
  FaBell,
} from "react-icons/fa";
import { MdLeaderboard } from "react-icons/md";
import { RiLiveFill } from "react-icons/ri";

const menuItems = [
  { name: "Home", icon: <FaHome size={18} />, path: "/" },
  { name: "Trending", icon: <FaBolt size={18} />, path: "/trending" },
  { name: "Categories", icon: <FaTags size={18} />, path: "/categories" },
  { name: "Bookmarks", icon: <FaBookmark size={18} />, path: "/bookmarks" },
  { name: "Live Q&A", icon: <RiLiveFill size={18} />, path: "/live" },
  { name: "Leaderboard", icon: <MdLeaderboard size={18} />, path: "/leaderboard" },
//   {
//   name: "Notifications",
//   icon: (
//     <div style={{ position: "relative" }}>
//       <FaBell size={18} />
//       {unreadCount > 0 && (
//         <span className="notification-badge">{unreadCount}</span>
//       )}
//     </div>
//   ),
//   path: "/notifications"
// },
  { name: "Community", icon: <FaUserFriends size={18} />, path: "/community" },
  { name: "Settings", icon: <FaCog size={18} />, path: "/settings" },
];

const Sidebar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const [unreadCount, setUnreadCount] = useState(0);
// useEffect(() => {
//   if (!currentUser) return;

//   const q = query(
//     collection(db, "notifications"),
//     where("userId", "==", currentUser.uid),
//     where("read", "==", false)
//   );

//   const unsubscribe = onSnapshot(q, (snapshot) => {
//     setUnreadCount(snapshot.size); // Number of unread
//   });

//   return () => unsubscribe();
// }, [currentUser]);


  const popularTags = [
    "javascript", "reactjs", "programming", "web development", "beginners",
    "python", "css", "html", "career"
  ];

  const toggleSubmenu = (menu) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">QnA</div>
        <button 
          className="collapse-toggle" 
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? "»" : "«"}
        </button>
      </div>

      {!collapsed && (
        <>
          <div className="sidebar-search">
            <FaSearch className="search-icon" />
            <input
              id="sidebar-search"
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </>
      )}

      <div className="sidebar-menu">
        {menuItems
          .filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => 
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <span className="icon">{item.icon}</span>
              {!collapsed && <span className="menu-text">{item.name}</span>}
            </NavLink>
          ))}
      </div>

      {!collapsed && (
        <>
          <div className="sidebar-section">
            <h3 
              className="sidebar-section-title"
              onClick={() => toggleSubmenu('tags')}
            >
              Popular Tags {activeSubmenu === 'tags' ? '▼' : '▶'}
            </h3>
            {activeSubmenu === 'tags' && (
              <div className="tag-cloud">
                {popularTags.map(tag => (
                  <NavLink 
                    key={tag} 
                    to={`/categories/${tag}`}
                    className="tag"
                  >
                    #{tag}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <style>{`

      .notification-badge {
  position: absolute;
  top: -5px;
  right: -8px;
  background: red;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 50%;
}

   .sidebar {
  width: 250px;
  height: 100vh;
  background: #ffffff;
  color: #333333;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  z-index: 1000;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
  border-right: 1px solid #eaeaea;
}

.sidebar.collapsed {
  width: 60px;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 15px;
  border-bottom: 1px solid #f0f0f0;
}

.sidebar-brand {
  font-size: 1.5rem;
  font-weight: bold;
  color: #4a6bff;
}

.collapse-toggle {
  background: transparent;
  border: none;
  color: #666666;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 5px;
  transition: all 0.2s;
}

.collapse-toggle:hover {
  color: #4a6bff;
}

.sidebar-search {
  padding: 15px;
  position: relative;
}

.sidebar-search input {
  width: 100%;
  padding: 8px 8px 8px 35px;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  background: #f9f9f9;
  color: #333333;
  transition: all 0.2s;
}

.sidebar-search input:focus {
  outline: none;
  border-color: #4a6bff;
  background: #ffffff;
  box-shadow: 0 0 0 2px rgba(74, 107, 255, 0.1);
}

.search-icon {
  position: absolute;
  left: 25px;
  top: 25px;
  color: #999999;
}

.sidebar-menu {
  flex: 1;
  overflow-y: auto;
  padding: 10px 0;
}

.sidebar-link {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #555555;
  text-decoration: none;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.sidebar-link:hover {
  background: #f5f7ff;
  color: #4a6bff;
}

.sidebar-link.active {
  background: #f5f7ff;
  color: #4a6bff;
  border-left: 3px solid #4a6bff;
  font-weight: 500;
}

.sidebar-link .icon {
  margin-right: 10px;
  color: inherit;
}

.sidebar.collapsed .menu-text {
  display: none;
}

.sidebar.collapsed .sidebar-link {
  justify-content: center;
}

.sidebar.collapsed .sidebar-link .icon {
  margin-right: 0;
}

.sidebar-section {
  padding: 15px;
  border-top: 1px solid #f0f0f0;
}

.sidebar-section-title {
  font-size: 0.9rem;
  margin: 0 0 10px 0;
  color: #777777;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s;
}

.sidebar-section-title:hover {
  color: #4a6bff;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tag {
  background: #f0f2ff;
  color: #4a6bff;
  padding: 3px 8px;
  border-radius: 20px;
  font-size: 0.8rem;
  text-decoration: none;
  transition: all 0.2s;
}

.tag:hover {
  background: #4a6bff;
  color: white;
}
      `}</style>
    </div>
  );
};

export default Sidebar;