import { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import "./App.css"
function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const SCOPE = ['https://www.googleapis.com/auth/drive'];
  const scopes = SCOPE.join(" ");
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log('Login Failed:', error),
    scope: scopes
  });

  useEffect(
    () => {
      if (user) {
        localStorage.setItem("access_token", user.access_token);
        fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            Accept: 'application/json'
          }
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            setProfile(data);
          })
          .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
          });
      }
    },
    [user]
  );

  const logOut = () => {
    googleLogout();
    setProfile(null);
  };

  return (
    <div>
      {
        profile ? (
          <div className='App'>
            <div className='auth'>
              <h2>User Logged in</h2>
              <div className='avatar'>
                <img src={profile.picture} alt="user image" />
                <div>
                  <p>Name: <span>{profile.name}</span></p>
                  <p>Email Address: <span>{profile.email} </span></p>
                </div>
              </div>
              <button className='Logout btn' onClick={logOut}>Log out</button>
            </div>
            <div className='fileupload'>
              <Home />
            </div>
          </div >
        ) : (
          <div className="App">
            <div className="auth">
              <h2>React Google Login</h2>
              <br />
              <button className='Login btn' onClick={login}>Sign in with Google 🚀 </button>
            </div>
          </div>
        )
      }
    </div>
  );

  function Home() {

    const [Images, SetImages] = useState([]);
    const Post = (e) => {
      e.target.style.background = "red";
      uploadImageToDrive(Images[0]);
    }

    const uploadImageToDrive = async (imageFile) => {
      try {

        const metadata = { name: imageFile.name };
        const fd = new FormData();
        fd.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        fd.append('file', imageFile);

        const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
          body: fd
        });

        if (res.ok) {
          const bb = await res.body;
          console.log(bb);
          console.log('Image uploaded successfully.');
          const btn = document.getElementById("post-btn");
          btn.style.background = "#4caf50";
        } else {
          console.error('Failed to upload image:', res.statusText);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    };

    const loadfile = (event) => {
      SetImages(event.target.files);
      var output = document.getElementById("output");
      const numberOfFiles = event.target.files.length;
      var firstImage = event.target.files[0] ? event.target.files[0] : "";
      if (numberOfFiles == 1) {
        output.innerText = firstImage.name
      }
      else {
        output.innerText = numberOfFiles + " files are selected";
      }
      output.style.height = "100px";
      output.style.padding = "2rem";
    };


    return (
      <>
        <header>
          <h2>Upload images to<br /> Google Drive</h2>
        </header>
        <form encType="multipart/form-data" className="createPost">
          <div className="post-header">
            <label htmlFor="FileUpload">Select File</label>
            <button type="submit" id="post-btn" onClick={(e) => { e.preventDefault(); Post(e) }}>Upload</button>
          </div>
          <div className="main-div">
            <div id="output">
            </div>
            <input
              hidden={true}
              id="FileUpload"
              name="FileUpload"
              className="inputFile"
              type="file"
              accept="image/*"
              onChange={(event) => {
                loadfile(event);
              }}
            />
          </div>
        </form >
      </>
    );
  }
}
export default App;

