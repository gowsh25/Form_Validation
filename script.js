document.getElementById("uname").addEventListener("input", function () {
  validateNameField();
});
document.getElementById("user-email").addEventListener("input", function () {
  validateEmailField();
});
document.getElementById("user-phone").addEventListener("input", function () {
  validateContactField();
});
document.getElementById("user-password").addEventListener("input", function () {
  validatePasswordField();
});
document.getElementById("user-name").addEventListener("input", function () {
  validateUsernameField();
});
document.getElementById("pan-number").addEventListener("input", function () {
  validatePANField();
});
document
  .getElementById("user-image")
  .addEventListener("change", validateImageFileSize);

document
  .getElementById("user-gender")
  .addEventListener("change", validateGenderDropdown);
document
  .getElementById("education")
  .addEventListener("change", validateEducationDropdown);

function validateNameField() {
  const nameInput = document.getElementById("uname");
  // Check if the input exists and is not empty
  if (!nameInput || nameInput.value.trim() === "") {
    document.getElementById("uname-validation").innerHTML =
      "Please Provide valid Username";
    nameInput.style.borderColor = "red";
    return false; // Input not found or empty
  }
  const nameValue = nameInput.value.trim();
  // Regular expression to match only alphabet letters and spaces
  const nameRegex = /^[A-Za-z\s]+$/;

  // Test if nameValue matches the pattern
  if (nameRegex.test(nameValue)) {
    nameInput.style.borderColor = "green"; // Indicate success
    return true;
  } else {
    // alert("Enter valid data");
    // empty(nameInput);
    document.getElementById("uname-validation").innerHTML =
      "Please Provide valid Username";
    nameInput.style.borderColor = "red"; // Indicate error, contains invalid characters
    return false;
  }
}

function validateEmailField() {
  const emailInput = document.getElementById("user-email");
  if (emailInput.value.trim().length === 0) {
    document.getElementById("email-validation").innerHTML = "Please provide valid Email";
    emailInput.style.borderColor = "red";
    return false; // Element not found
  }

  const emailValue = emailInput.value;
  // Simple regular expression for basic email validation
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (emailRegex.test(emailValue)) {
    emailInput.style.borderColor = "green"; // Indicate success
    return true;
  } else {
    document.getElementById("email-validation").innerHTML =
      "Please provide valid Email";
    emailInput.style.borderColor = "red"; // Indicate error
    return false;
  }
}

function validateContactField() {
  const contactInput = document.getElementById("user-phone");
  const contactValue = contactInput.value;
  const contactRegex = /^\+91[6-9]\d{9}$/;

  if (contactRegex.test(contactValue)) {
    contactInput.style.borderColor = "green";
    return true;
  } else {
    // alert("Enter valid data");
    // empty(contactInput);
    document.getElementById("phone-validation").innerHTML =
      "Please provide valid Contact Number";
    contactInput.style.borderColor = "red";
    return false;
  }
}

function validatePANField() {
  const panInput = document.getElementById("pan-number");
  const panValue = panInput.value;
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

  if (panRegex.test(panValue)) {
    panInput.style.borderColor = "green";
    return true;
  } else {
    document.getElementById("pan-validation").innerHTML = "Please provide valid PAN";
    panInput.style.borderColor = "red";
    return false;
    stbutton;
  }
}

function validatePasswordField() {
  const passwordInput = document.getElementById("user-password");
  const passwordValue = passwordInput.value;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (passwordRegex.test(passwordValue)) {
      passwordInput.style.borderColor = "green";
    return true;
  } else {
    document.getElementById("password-validation").innerHTML = "Please provide valid Password";
    passwordInput.style.borderColor = "red";
    return false;
  }
}

function validateUsernameField() {
  const usernameInput = document.getElementById("user-name");
  const usernameValue = usernameInput.value;
  const usernameRegex = /^[a-zA-Z0-9]{4,20}$/;

  // First, check if the username meets the basic pattern requirements
  if (!usernameRegex.test(usernameValue)) {
    document.getElementById("user-name-validation").innerHTML = "Please Provide valid User name";
    usernameInput.style.borderColor = "red";
    return false;
  }

  // Then, check if the username is unique
  if (!isUsernameUnique(usernameValue)) {
    document.getElementById("user-name-validation").innerHTML =
      "Please Provide valid User name";
    usernameInput.style.borderColor = "red";
    // Optionally, you could provide more specific feedback to the user
    alert("Username already taken. Please choose another.");
    return false;
  }

  // If all checks pass
  usernameInput.style.borderColor = "green";
  return true;
}

function isUsernameUnique(username) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  // console.log(users);
  for (let user of users) {
    if (user.username === username) {
      return false; // Username is not unique
    }
  }
  return true; // Username is unique
}

function validateGenderDropdown() {
  const genderSelect = document.getElementById("user-gender");
  if (genderSelect.value === "") {
    genderSelect.classList.remove("success");
    genderSelect.classList.add("error");
    return false;
  } else {
    genderSelect.classList.remove("error");
    genderSelect.classList.add("success");
    return true;
  }
}

function validateEducationDropdown() {
  const educationSelect = document.getElementById("education");
  if (educationSelect.value === "") {
    educationSelect.classList.remove("success");
    educationSelect.classList.add("error");
    return false;
  } else {
    educationSelect.classList.remove("error");
    educationSelect.classList.add("success");
    return true;
  }
}

function validateImageFileSize() {
  const fileInput = document.getElementById("user-image");
  const fileSizeLimit = 2 * 1024 * 1024; // 2 MB in bytes
  const fileSizeFeedback = document.getElementById("file-size-feedback"); // Adjusted ID for generality
  const result = true;

  if (fileInput.files.length > 0) {
    const fileSize = fileInput.files[0].size;

    if (fileSize > fileSizeLimit) {
      fileSizeFeedback.textContent = "File must be less than 2MB"; // Update text content
      fileInput.value = "";
      fileSizeFeedback.classList.add("error");
      fileSizeFeedback.classList.remove("success");
      fileSizeFeedback.style.display = "block";
      fileInput.value = ""; // Clear the selected file
      return false;
    } else {
      fileSizeFeedback.textContent = "File size is okay"; // Positive feedback text
      fileSizeFeedback.classList.remove("error");
      fileSizeFeedback.classList.add("success");
      fileSizeFeedback.style.display = "block";
      return true;
    }
  } else {
    // No file selected, hide the feedback message
    fileSizeFeedback.textContent = "File not selected";
    fileSizeFeedback.style.display = "none";
    return false;
  }
}

document.getElementById("stbutton").addEventListener("click", function (event) {
  event.preventDefault();
  if (isFormFilled()) {
    console.log(56);
    var users = JSON.parse(localStorage.getItem("users")) || [];
    const user = {
      name: document.getElementById("uname").value,
      email: document.getElementById("user-email").value,
      contact_no: document.getElementById("user-phone").value,
      dob: document.getElementById("user-dob").value,
      gender: document.getElementById("user-gender").value,
      edu: document.getElementById("education").value,
      username: document.getElementById("user-name").value,
      password: document.getElementById("user-password").value,
      pan_no: document.getElementById("pan-number").value,
      image: imageData,
    };
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    console.log(users);
    document.getElementById("mid-form").reset();
    alert("User data saved successfully!");
  } else {
    alert("Please fill out all fields before submitting.");
  }
});

const fileInput = document.getElementById("user-image");
let imageData = null;
fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0]; // Get the selected image file
  if (file) {
    const reader = new FileReader();
    reader.readAsDataURL(file); // Read the file as a data URL
    reader.onload = (event) => {
      const base64Data = event.target.result; // Access the data URL
      // Create an object with the image data
      imageData = {
        filename: file.name,
        type: file.type,
        size: file.size,
        data: base64Data,
      };
    };
  }
});

function findUserByUsername(search_name) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  console.log("Users in storage:", users); // Verify the users array

  for (let i = 0; i < users.length; i++) {
    console.log("Checking user:", users[i].username); // Log each username being checked
    if (users[i].username === search_name) {
      return users[i]; // or return users[i] to return the user object
    }
  }

  return null;
}

function isFormFilled() {
  console.log(validateImageFileSize());
  console.log(validateEmailField());
  console.log(validateContactField());
  console.log(validateEducationDropdown());
  console.log(validateGenderDropdown());
  console.log(validateNameField());
  console.log(validatePANField());
  console.log(validatePasswordField());
  console.log(validateUsernameField());
  if (
    validateImageFileSize() &&
    validateEmailField() &&
    validateContactField() &&
    validateEducationDropdown() &&
    validateGenderDropdown() &&
    validateNameField() &&
    validatePANField() &&
    validatePasswordField() &&
    validateUsernameField()
  ) {
    return true;
  }

  return false;
}

function SearchByName(search_name) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  var bol = false;
  for (let i = 0; i < users.length; i++) {
    if (users[i].name === search_name) {
      bol = true;
      display_User(users[i]); // or return users[i] to return the user object
    }
  }
  if (bol === false) {
    alert("User not found");
  }
}

document
  .getElementById("searchBtn")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const search_name = document.getElementById("search").value;

    if (searchByDays(search_name)) {
      var age = ageConverter(search_name);
      const users = JSON.parse(localStorage.getItem("users")) || [];
      var flg = false;
      for (let i = 0; i < users.length; i++) {
        if (calculateAge(users[i].dob) <= age) {
          flg = true;
          display_User(users[i]); // or return users[i] to return the user object
        }
      }
      if (flg == false) {
        alert("User not found");
      }
    } else if (searchBySize(search_name)) {
      var size = extractSizeFromSearchValue(search_name);
      var flg = false;
      const users = JSON.parse(localStorage.getItem("users")) || [];
      for (let i = 0; i < users.length; i++) {
        if (users[i].image.size <= size) {
          flg = true;
          display_User(users[i]);
        }
      }
      if (flg == false) {
        alert("User not found");
      }
    } else {
      SearchByName(search_name);
    }
  });

function searchBySize(search_name) {
  const sizePattern = /(\d+)\s*(MB|KB|bytes|mb|kb)/i;
  const match = search_name.match(sizePattern);
  if (!match) return false;
  return true;
}

function extractSizeFromSearchValue(searchValue) {
  // Regular expression to match the number and unit (MB, KB, or bytes)
  const sizePattern = /(\d+)\s*(MB|KB|bytes|mb|kb?)/i;
  const match = searchValue.match(sizePattern);

  if (match) {
    const value = parseFloat(match[1]); // Extract the numeric value
    const unit = match[2].toLowerCase(); // Normalize the unit for comparison

    let sizeInBytes;

    switch (unit) {
      case "MB":
      case "mb":
        sizeInBytes = value * 1024 * 1024; // Convert MB to bytes
        break;
      case "KB":
      case "kb":
        sizeInBytes = value * 1024; // Convert KB to bytes
        break;
      case "byte":
      case "bytes": // Handling both 'byte' and 'bytes' for completeness
        sizeInBytes = value;
        break;
      default:
        console.error("Unknown unit for size.");
        return null;
    }

    return sizeInBytes;
  }
}

function calculateAge(dob) {
  const birthDate = new Date(dob);
  const currentDate = new Date();

  let age = currentDate.getFullYear() - birthDate.getFullYear();
  const monthDifference = currentDate.getMonth() - birthDate.getMonth();

  // If the current month is before the birth month, or
  // it's the birth month but the current day is before the birth day, decrease the age by 1.
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

function searchByDays(searchValue) {
  // This pattern matches a string that consists only of digits
  const onlyDigitsPattern = /^\d+$/;
  const match = searchValue.match(onlyDigitsPattern);
  if (!match) {
    return false; // The search value does not consist of only digits
  }
  return true; // The search value consists of only digits
}

function ageConverter(searchValue) {
  if (isNaN(searchValue)) {
    return "Invalid number of days.";
  }

  // Convert days into years, months, and remaining days
  const years = Math.floor(searchValue / 365);

  return years;
}

function display_User(user) {
  const userDetailsContainer = document.getElementById("userDetailsContainer");
  if (!userDetailsContainer) {
    console.log("User details container not found.");
    return;
  }

  if (user != null) {
    // Create a container for this user's details
    const userDiv = document.createElement("div");
    userDiv.classList.add("user-details");

    // Create and append elements for each piece of user data

    const imageDiv = document.createElement("div");
    if (user.image) {
      const img = document.createElement("img");
      img.src = user.image.data;
      img.alt = "User Image";
      img.style.maxWidth = "100px";
      imageDiv.appendChild(img);
    } else {
      imageDiv.textContent = "Image: Not available";
    }
    userDiv.appendChild(imageDiv);

    const userData = [
      { label: "Name", value: user.name },
      { label: "Email", value: user.email },
      { label: "Contact No", value: user.contact_no },
      { label: "DOB", value: user.dob },
      { label: "Gender", value: user.gender },
      { label: "Education", value: user.edu },
      { label: "Username", value: user.username },
      { label: "PAN No", value: user.pan_no },
    ];

    userData.forEach(({ label, value }) => {
      const detailDiv = document.createElement("div");
      detailDiv.textContent = `${label}: ${value}`;
      userDiv.appendChild(detailDiv);
    });

    // Handle the image display separately to include an <img> element

    // if (user.image) {
    //   const img = document.createElement("img");
    //   img.src = user.image.data;
    //   img.alt = "User Image";
    //   img.style.maxWidth = "100px";
    //   imageDiv.appendChild(img);
    // } else
    //  {
    //   imageDiv.textContent = "Image: Not available";
    // }
    // userDiv.appendChild(imageDiv);

    // Append the userDiv to the userDetailsContainer
    userDetailsContainer.appendChild(userDiv);
  } else {
    console.log("No user data found.");
  }
}

function togglePassword() {
  var passwordField = document.getElementById("user-password");
  var toggleButton = document.getElementById("togglePassword");

  if (passwordField.type === "password") {
    passwordField.type = "text";
    toggleButton.innerHTML =
      '<img src="eye-open.png" alt="Hide Password" width="20">';
  } else {
    passwordField.type = "password";
    toggleButton.innerHTML =
      '<img src="eye-close.png" alt="Show Password" width="20">';
  }
}

// function empty(search_value){
//   return search_value.value="";
// }
