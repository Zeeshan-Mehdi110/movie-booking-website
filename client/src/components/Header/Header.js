import React, { useEffect, useState } from "react";
import {
  AppBar,
  Autocomplete,
  Box,
  Tab,
  Tabs,
  TextField,
  Toolbar,
} from "@mui/material";
import MovieCreationIcon from "@mui/icons-material/MovieCreation";
import { getAllMovies } from "../../helpers/api-helpers";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../store/user-slice";
import { adminActions } from "../../store/admin-slice";

const Header = () => {
  const navigate = useNavigate();
  const [selectedMovie, setSelectedMovie] = useState("");
  const [value, setValue] = useState();
  const [data, setData] = useState([]);
  const isUserLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const isAdminLoggedIn = useSelector((state) => state.admin.isLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    getAllMovies()
      .then((data) => setData(data))
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (e, val) => {
    setSelectedMovie(val);
    const movie = data.find((mov) => mov.title === val);
    console.log(movie);
    if (isUserLoggedIn) {
      navigate(`/booking/${movie._id}`);
    }
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: "#2b2d42" }}>
      <Toolbar>
        <Box width="20%">
          <Link to="/" style={{ color: "white" }}>
            <MovieCreationIcon />
          </Link>
        </Box>
        <Box width="50%" marginRight={"auto"} marginLeft="auto">
          {/* Autocomplete code */}
        </Box>
        <Box display="flex">
        // ...

          <Tabs onChange={(e, val) => setValue(val)} value={value} textColor="inherit">
            {!isAdminLoggedIn && !isUserLoggedIn && (
              <>
                <Tab component={NavLink} to="/auth" label="Auth" />
                <Tab component={NavLink} to="/admin" label="Admin" />
              </>
            )}

            {isUserLoggedIn && (
              <>
                <Tab component={Link} to="/user" label="User" />
                <Tab
                  onClick={() => dispatch(userActions.logout())}
                  component={Link}
                  to="/"
                  label="Logout"
                />
              </>
            )}

            {isAdminLoggedIn && (
              <>
                <Tab component={Link} to="/profile" label="Profile" />
                <Tab component={Link} to="/add" label="Add Movie" />
                <Tab
                  onClick={() => dispatch(adminActions.logout())}
                  component={Link}
                  to="/"
                  label="Logout"
                />
              </>
            )}
          </Tabs>

// ...

        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
