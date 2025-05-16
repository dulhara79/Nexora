package com.nexora.server.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

// import javax.validation.constraints.Email;
// import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents a user in the system.
 */
@Data
@Document(collection = "users")
public class User {
  @Id
  private String id; // Unique identifier for the user

  // @NotBlank(message = "Email is required")
  // @Email(message = "Invalid email format")
  private String email; // User's email address

  // @Size(min = 6, message = "Password must be at least 6 characters")
  private String password; // User's hashed password

  // @NotBlank(message = "Name is required")
  // @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
  private String name; // User's full name

  // @NotBlank(message = "Username is required")
  // @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
  private String username; // Unique username

  private String about; // Short bio or description
  private String profilePhotoUrl; // URL to profile photo
  private String bannerPhotoUrl; // URL to banner photo
  private String likeSkill; // User's preferred skill or interest

  private boolean emailVerified = false; // Email verification status
  private String verificationCode; // Code for email verification
  private LocalDateTime createdAt = LocalDateTime.now(); // Account creation timestamp
  private LocalDateTime lastLogin; // Last login timestamp

  private List<String> followers = new ArrayList<>(); // List of user IDs who follow this user
  private List<String> following = new ArrayList<>(); // List of user IDs this user follows
  private List<SocialMediaLink> socialMedia = new ArrayList<>(); // List of social media links
  private List<String> bookmarkedPosts = new ArrayList<>(); // List of post IDs bookmarked by user
  private List<String> savedQuestionIds = new ArrayList<>(); // List of saved question IDs

  private Role role; // User's role (e.g., ADMIN, USER)

  /**
   * Default constructor.
   */
  public User() {
  }

  /**
   * Parameterized constructor for User.
   */
  public User(String id, String email, String password, String name, String username, String about,
      String profilePhotoUrl,
      String bannerPhotoUrl, String likeSkill, boolean emailVerified, String verificationCode,
      LocalDateTime createdAt, LocalDateTime lastLogin, List<String> followers, List<String> following,
      List<SocialMediaLink> socialMedia, List<String> bookmarkedPosts, Role role) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.name = name;
    this.username = username;
    this.about = about;
    this.profilePhotoUrl = profilePhotoUrl;
    this.bannerPhotoUrl = bannerPhotoUrl;
    this.likeSkill = likeSkill;
    this.emailVerified = emailVerified;
    this.verificationCode = verificationCode;
    this.createdAt = createdAt;
    this.lastLogin = lastLogin;
    this.followers = followers;
    this.following = following;
    this.socialMedia = socialMedia;
    this.bookmarkedPosts = bookmarkedPosts;
    this.role = role;
  }

  // Getters and Setters

  /**
   * Gets the user ID.
   */
  public String getId() {
    return id;
  }

  /**
   * Sets the user ID.
   */
  public void setId(String id) {
    this.id = id;
  }

  /**
   * Gets the user's email.
   */
  public String getEmail() {
    return email;
  }

  /**
   * Sets the user's email.
   */
  public void setEmail(String email) {
    this.email = email;
  }

  /**
   * Gets the user's password.
   */
  public String getPassword() {
    return password;
  }

  /**
   * Sets the user's password.
   */
  public void setPassword(String password) {
    this.password = password;
  }

  /**
   * Gets the user's name.
   */
  public String getName() {
    return name;
  }

  /**
   * Sets the user's name.
   */
  public void setName(String name) {
    this.name = name;
  }

  /**
   * Gets the user's username.
   */
  public String getUsername() {
    return username;
  }

  /**
   * Sets the user's username.
   */
  public void setUsername(String username) {
    this.username = username;
  }

  /**
   * Gets the user's about/bio.
   */
  public String getAbout() {
    return about;
  }

  /**
   * Sets the user's about/bio.
   */
  public void setAbout(String about) {
    this.about = about;
  }

  /**
   * Gets the profile photo URL.
   */
  public String getProfilePhotoUrl() {
    return profilePhotoUrl;
  }

  /**
   * Sets the profile photo URL.
   */
  public void setProfilePhotoUrl(String profilePhotoUrl) {
    this.profilePhotoUrl = profilePhotoUrl;
  }

  /**
   * Gets the banner photo URL.
   */
  public String getBannerPhotoUrl() {
    return bannerPhotoUrl;
  }

  /**
   * Sets the banner photo URL.
   */
  public void setBannerPhotoUrl(String bannerPhotoUrl) {
    this.bannerPhotoUrl = bannerPhotoUrl;
  }

  /**
   * Gets the user's liked skill.
   */
  public String getLikeSkill() {
    return likeSkill;
  }

  /**
   * Sets the user's liked skill.
   */
  public void setLikeSkill(String likeSkill) {
    this.likeSkill = likeSkill;
  }

  /**
   * Checks if the user's email is verified.
   */
  public boolean isEmailVerified() {
    return emailVerified;
  }

  /**
   * Sets the email verification status.
   */
  public void setEmailVerified(boolean emailVerified) {
    this.emailVerified = emailVerified;
  }

  /**
   * Gets the verification code.
   */
  public String getVerificationCode() {
    return verificationCode;
  }

  /**
   * Sets the verification code.
   */
  public void setVerificationCode(String verificationCode) {
    this.verificationCode = verificationCode;
  }

  /**
   * Gets the account creation timestamp.
   */
  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  /**
   * Sets the account creation timestamp.
   */
  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  /**
   * Gets the last login timestamp.
   */
  public LocalDateTime getLastLogin() {
    return lastLogin;
  }

  /**
   * Sets the last login timestamp.
   */
  public void setLastLogin(LocalDateTime lastLogin) {
    this.lastLogin = lastLogin;
  }

  /**
   * Gets the list of followers.
   */
  public List<String> getFollowers() {
    return followers;
  }

  /**
   * Sets the list of followers.
   */
  public void setFollowers(List<String> followers) {
    this.followers = followers;
  }

  /**
   * Gets the list of users this user is following.
   */
  public List<String> getFollowing() {
    return following;
  }

  /**
   * Sets the list of users this user is following.
   */
  public void setFollowing(List<String> following) {
    this.following = following;
  }

  /**
   * Gets the list of social media links.
   */
  public List<SocialMediaLink> getSocialMedia() {
    return socialMedia;
  }

  /**
   * Sets the list of social media links.
   */
  public void setSocialMedia(List<SocialMediaLink> socialMedia) {
    this.socialMedia = socialMedia;
  }

  /**
   * Gets the list of bookmarked post IDs.
   */
  public List<String> getBookmarkedPosts() {
    return bookmarkedPosts;
  }

  /**
   * Sets the list of bookmarked post IDs.
   */
  public void setBookmarkedPosts(List<String> bookmarkedPosts) {
    this.bookmarkedPosts = bookmarkedPosts;
  }

  /**
   * Gets the user's role.
   */
  public Role getRole() {
    return role;
  }

  /**
   * Sets the user's role.
   */
  public void setRole(Role role) {
    this.role = role;
  }

  /**
   * Gets the list of saved question IDs.
   */
  public List<String> getSavedQuestionIds() {
    return savedQuestionIds;
  }

  /**
   * Sets the list of saved question IDs.
   */
  public void setSavedQuestionIds(List<String> savedQuestionIds) {
    this.savedQuestionIds = savedQuestionIds;
  }
}
