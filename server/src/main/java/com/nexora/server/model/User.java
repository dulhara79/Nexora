package com.nexora.server.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "users")
public class User {
  @Id
  private String id;

  @NotBlank(message = "Email is required")
  @Email(message = "Invalid email format")
  private String email;

  @Size(min = 6, message = "Password must be at least 6 characters")
  private String password;

  @NotBlank(message = "Name is required")
  @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
  private String name;

  @NotBlank(message = "Skill is required")
  private String likeSkill;

  private String profilePhotoUrl = null;
  // private String profilePhotoUrl;
  private boolean emailVerified = false;
  private String verificationCode;

  private List<String> followers = new ArrayList<>();
  private List<String> following = new ArrayList<>();

  private Role role; // No @Enumerated needed for MongoDB

  // Fields added for EditProfile
  private String username;
  private String about;
  private String bannerPhotoUrl;
  private List<SocialMediaLink> socialMedia = new ArrayList<>(); // Using a custom class for social media

  // Default constructor
  public User() {
  }

  // Parameterized constructor (updated)
  public User(String id, String email, String password, String name, String likeSkill, String profilePhotoUrl,
      boolean emailVerified, String verificationCode, List<String> followers, List<String> following,
      Role role, String username, String about, String bannerPhotoUrl, List<SocialMediaLink> socialMedia) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.name = name;
    this.likeSkill = likeSkill;
    this.profilePhotoUrl = profilePhotoUrl;
    this.emailVerified = emailVerified;
    this.verificationCode = verificationCode;
    this.followers = followers;
    this.following = following;
    this.role = role;
    this.username = username;
    this.about = about;
    this.bannerPhotoUrl = bannerPhotoUrl;
    this.socialMedia = socialMedia;
  }

  // Getters and Setters (updated)
  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getAbout() {
    return about;
  }

  public void setAbout(String about) {
    this.about = about;
  }

  public String getBannerPhotoUrl() {
    return bannerPhotoUrl;
  }

  public void setBannerPhotoUrl(String bannerPhotoUrl) {
    this.bannerPhotoUrl = bannerPhotoUrl;
  }

  public List<SocialMediaLink> getSocialMedia() {
    return socialMedia;
  }

  public void setSocialMedia(List<SocialMediaLink> socialMedia) {
    this.socialMedia = socialMedia;
  }

  // Getters and Setters
  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getLikeSkill() {
    return likeSkill;
  }

  public void setLikeSkill(String likeSkill) {
    this.likeSkill = likeSkill;
  }

  public String getProfilePhotoUrl() {
    return profilePhotoUrl;
  }

  public void setProfilePhotoUrl(String profilePhotoUrl) {
    this.profilePhotoUrl = profilePhotoUrl;
  }

  public boolean isEmailVerified() {
    return emailVerified;
  }

  public void setEmailVerified(boolean emailVerified) {
    this.emailVerified = emailVerified;
  }

  public String getVerificationCode() {
    return verificationCode;
  }

  public void setVerificationCode(String verificationCode) {
    this.verificationCode = verificationCode;
  }

  public List<String> getFollowers() {
    return followers;
  }

  public void setFollowers(List<String> followers) {
    this.followers = followers;
  }

  public List<String> getFollowing() {
    return following;
  }

  public void setFollowing(List<String> following) {
    this.following = following;
  }
}
