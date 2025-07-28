export const categoryImages = {
    'Web Development': 'https://tse3.mm.bing.net/th?id=OIP.IuXwBcAz0Kv5-HY0wX6MygHaFj&pid=Api&P=0&h=180',
    'html': 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'css': 'https://tse1.mm.bing.net/th?id=OIP.8kNko0ip-RZ125_-PCSAiAHaIZ&pid=Api&P=0&h=180',
    'javascript': 'https://www.lionblogger.com/wp-content/uploads/2017/12/js.jpg',
    'ReactJS': 'https://pluspng.com/img-png/react-logo-png-img-react-logo-png-react-js-logo-png-transparent-png-1142x1027.png',
    'Machine Learning': 'https://tse2.mm.bing.net/th?id=OIP.vo3M_xHubdm9j47KWO3D1AHaEK&pid=Api&P=0&h=180',
    'Cybersecurity': 'https://static.vecteezy.com/system/resources/previews/007/447/922/large_2x/concept-of-cyber-security-information-security-and-encryption-secure-access-to-user-s-personal-information-secure-internet-access-cybersecurity-photo.jpg',
    // You can add more known ones here...
  };
  
  export const getCategoryImage = (category) => {
    if (categoryImages[category]) return categoryImages[category];
    return `https://source.unsplash.com/600x400/?${encodeURIComponent(category)},technology`;
  };
  