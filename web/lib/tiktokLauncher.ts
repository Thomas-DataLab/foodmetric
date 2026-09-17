/**
 * Smart TikTok App Launcher & Deep-Linking Utility
 * Triệt tiêu bẫy Webview in-app, bật thẳng ứng dụng TikTok chính thức trên mobile.
 */

export interface OpenTikTokOptions {
  webUrl?: string;
  videoId?: string;
  creatorHandle?: string;
  productName?: string;
}

/**
 * Tự động trích xuất videoId từ videoUrl nếu chưa có
 */
export function extractVideoId(url?: string): string | undefined {
  if (!url) return undefined;
  const match = url.match(/video\/(\d+)/);
  return match ? match[1] : undefined;
}

/**
 * Tự động trích xuất handle creator từ URL nếu có
 */
export function extractCreatorHandle(url?: string): string | undefined {
  if (!url) return undefined;
  const match = url.match(/@([\w.-]+)/);
  return match ? match[1] : undefined;
}

/**
 * Mở trực tiếp app TikTok trên Mobile hoặc tab web mới trên Desktop
 */
export function openTikTok(options: OpenTikTokOptions): void {
  if (typeof window === "undefined") return;

  const rawHandle = options.creatorHandle || extractCreatorHandle(options.webUrl);
  const creatorHandle = rawHandle ? rawHandle.replace(/^@/, "") : undefined;
  const webUrl =
    options.webUrl ||
    (creatorHandle
      ? `https://www.tiktok.com/@${creatorHandle}`
      : "https://www.tiktok.com/@foodlenlut");

  const { productName } = options;
  const videoId = options.videoId || extractVideoId(webUrl);

  // Auto-copy tên sản phẩm vào clipboard trên mobile để hỗ trợ tìm kiếm nếu cần
  if (productName && typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      navigator.clipboard.writeText(productName);
    } catch {
      // Bỏ qua lỗi clipboard
    }
  }

  const userAgent = navigator.userAgent || "";
  const isAndroid = /Android/i.test(userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
  const isMobile = isAndroid || isIOS;

  // 1. Nếu là Desktop: Mở tab mới thông thường
  if (!isMobile) {
    window.open(webUrl, "_blank", "noopener,noreferrer");
    return;
  }

  // 2. Nếu là Android: Dùng Android Intent URL Scheme (cực kỳ ổn định và tự động fallback)
  if (isAndroid) {
    let intentUrl = "";
    const encodedFallback = encodeURIComponent(webUrl);

    if (videoId) {
      intentUrl = `intent://aweme/detail/${videoId}#Intent;scheme=snssdk1180;package=com.zhiliaoapp.musically;S.browser_fallback_url=${encodedFallback};end;`;
    } else if (creatorHandle) {
      intentUrl = `intent://user/profile?unique_id=${creatorHandle}#Intent;scheme=snssdk1180;package=com.zhiliaoapp.musically;S.browser_fallback_url=${encodedFallback};end;`;
    } else {
      window.location.href = webUrl;
      return;
    }

    window.location.href = intentUrl;
    return;
  }

  // 3. Nếu là iOS: Kích hoạt Custom URL Scheme kèm Timeout Fallback
  if (isIOS) {
    let deepLinkUrl = "";
    if (videoId) {
      deepLinkUrl = `snssdk1180://aweme/detail/${videoId}`;
    } else if (creatorHandle) {
      deepLinkUrl = `snssdk1180://user/profile?unique_id=${creatorHandle}`;
    }

    if (deepLinkUrl) {
      const startTime = Date.now();
      window.location.href = deepLinkUrl;

      // Nếu sau 1.5s người dùng chưa chuyển sang app TikTok (nghĩa là app chưa cài hoặc bị chặn)
      setTimeout(() => {
        if (!document.hidden && Date.now() - startTime < 2000) {
          window.location.href = webUrl;
        }
      }, 1500);
    } else {
      window.location.href = webUrl;
    }
  }
}
