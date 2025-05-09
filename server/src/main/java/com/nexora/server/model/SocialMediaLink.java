package com.nexora.server.model;

import lombok.Data;

@Data
public class SocialMediaLink {
    private String platform; // e.g., "instagram", "twitter"
    private String url;

    public SocialMediaLink() {}

    public SocialMediaLink(String platform, String url) {
        this.platform = platform;
        this.url = url;
    }

    public String getPlatform() {
        return platform;
    }

    public void setPlatform(String platform) {
        this.platform = platform;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
