// Check if device is Android
const isAndroid = () => /android/i.test(navigator.userAgent || navigator.vendor || window.opera);

// Check if device is iOS
const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

// Open app intent URL with fallback
function openIntentURL(intentURL, fallbackURL) {
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = intentURL;
  document.body.appendChild(iframe);
  setTimeout(() => {
    window.location.href = fallbackURL;
  }, 1000);
}

// Navigation links data
const navLinks = [
  {
    id: 'instagram',
    label: 'Instagram',
    iconClass: 'bx bxl-instagram',
    redirectFunction: () => {
      if (isAndroid()) {
        openIntentURL(
          'intent://user?username=fitroyanugraha#Intent;package=com.instagram.android;scheme=https;end',
          'https://instagram.com/fitroyanugraha/'
        );
      } else if (isIOS()) {
        window.location.href = 'instagram://user?username=fitroyanugraha';
      } else {
        window.location.href = 'https://instagram.com/fitroyanugraha/';
      }
    }
  },
  {
    id: 'tiktok',
    label: 'Tiktok',
    iconClass: 'bx bxl-tiktok',
    redirectFunction: () => {
      if (isAndroid()) {
        openIntentURL(
          'intent://user/profile/6897101026814428161#Intent;package=com.zhiliaoapp.musically;scheme=snssdk1233;end',
          'https://www.tiktok.com/@swadikap.kopikap/'
        );
      } else if (isIOS()) {
        window.location.href = 'snssdk1233://user/profile/6897101026814428161';
      } else {
        window.location.href = 'https://www.tiktok.com/@swadikap.kopikap/';
      }
    }
  },
  {
    id: 'linkedin',
    label: 'Linkedin',
    iconClass: 'bx bxl-linkedin',
    redirectFunction: () => {
      window.location.href = 'https://www.linkedin.com/in/fitroya-nugraha';
    }
  },
  {
    id: 'portfolio',
    label: 'Portofolio Web',
    iconClass: 'bx bx-news',
    redirectFunction: () => {
      window.location.href = 'https://piter.lovestoblog.com/';
    }
  }
];

export default navLinks;
