export interface Post {
  id: number;
  content: string;
  coverImage: string;
  title: string;
  userName: string;
  like: number;
  views: number;
  comments: number;
  createdDate: Date;
  badges: string[];
  userLiked: boolean;
}

export const dummyPosts: Post[] = [
  {
    id: 1,
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et eros nec turpis vestibulum suscipit. Phasellus euismod lacus vitae fermentum venenatis. Quisque eleifend eros in metus ultrices, vitae varius mi vestibulum.',
    coverImage: 'kayak.jpg',
    title: 'The Impact of Climate Change on Global Agriculture',
    userName: 'JohnDoe',
    like: 124,
    views: 589,
    comments: 37,
    createdDate: new Date(),
    userLiked: true,
    badges: ['sport', 'fitness'],
  },
  {
    id: 2,
    content:
      'Proin suscipit ultricies sem nec vestibulum. Vivamus consectetur turpis id sapien tristique vehicula. Sed nec eros gravida, varius magna vel, ullamcorper odio. Nullam scelerisque magna et turpis tempus, id tincidunt dui dapibus.',
    coverImage: 'kayak.jpg',
    title: 'Exploring the Wonders of Deep Sea Diving',
    userName: 'AdventureSeeker',
    like: 89,
    views: 432,
    comments: 22,
    createdDate: new Date(),
    userLiked: false,
    badges: ['sport', 'fitness'],
  },
  {
    id: 3,
    content:
      'Duis rhoncus commodo justo, sit amet suscipit libero. Sed consequat nisi eu nunc viverra, ac dignissim lacus ullamcorper. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.',
    coverImage: 'kayak.jpg',
    title: 'The Art of Sustainable Living: A Guide to Eco-Friendly Practices',
    userName: 'GreenLifestyle',
    like: 197,
    views: 789,
    comments: 45,
    createdDate: new Date(),
    userLiked: false,
    badges: ['sport', 'fitness'],
  },
  {
    id: 4,
    content:
      'Maecenas volutpat eget ex vitae tempus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse potenti. Nulla facilisi. Sed pharetra dui eget lorem interdum, et tincidunt urna eleifend.',
    coverImage: 'kayak.jpg',
    title: 'The Rise of Artificial Intelligence in Healthcare',
    userName: 'HealthTechEnthusiast',
    like: 156,
    views: 654,
    comments: 28,
    createdDate: new Date(),
    userLiked: true,
    badges: ['sport', 'fitness'],
  },
  {
    id: 5,
    content:
      'Curabitur ullamcorper risus at est vehicula, nec suscipit eros luctus. Vivamus nec dolor eu nisi euismod iaculis non id tortor. Cras dapibus odio et nisi tempor, non consequat elit pharetra.',
    coverImage: 'kayak.jpg',
    title: 'Unlocking Creativity: Tips and Tricks for Overcoming Creative Blocks',
    userName: 'CreativeMind',
    like: 231,
    views: 876,
    comments: 63,
    createdDate: new Date(),
    userLiked: true,
    badges: ['sport', 'fitness'],
  },
  {
    id: 6,
    content:
      'In condimentum suscipit leo nec gravida. Nulla facilisi. Integer nec nulla vel nisi vehicula facilisis in vitae quam. Nam nec mi feugiat, consequat odio sit amet, volutpat ex.',
    coverImage: 'kayak.jpg',
    title: 'The Future of Urban Transportation: Challenges and Solutions',
    userName: 'UrbanExplorer',
    like: 142,
    views: 701,
    comments: 41,
    createdDate: new Date(),
    userLiked: true,
    badges: ['sport', 'fitness'],
  },
  {
    id: 7,
    content:
      'Praesent feugiat odio eu metus laoreet, vel fringilla turpis efficitur. Vivamus nec ex vel risus semper suscipit. Fusce in augue sit amet leo fermentum commodo.',
    coverImage: 'kayak.jpg',
    title: 'The Psychology of Decision Making: Understanding Human Behavior',
    userName: 'MindExplorer',
    like: 178,
    views: 823,
    comments: 59,
    createdDate: new Date(),
    userLiked: true,
    badges: ['sport', 'fitness'],
  },
  {
    id: 8,
    content:
      'Vivamus eget libero at nisl consequat feugiat. Quisque lacinia, ligula ut sollicitudin dictum, metus odio luctus magna, ac lacinia mi enim nec velit.',
    coverImage: 'kayak.jpg',
    title: 'The Art of Mindfulness: Techniques for Stress Reduction',
    userName: 'MindfulnessGuru',
    like: 206,
    views: 945,
    comments: 73,
    createdDate: new Date(),
    userLiked: true,
    badges: ['sport', 'fitness'],
  },
  {
    id: 9,
    content:
      'Integer dignissim libero eget felis ullamcorper ultricies. Duis eleifend tortor id justo vehicula, eget ultricies ligula consequat. Sed nec sapien hendrerit, dictum sapien nec, dapibus nisi.',
    coverImage: 'kayak.jpg',
    title: 'Space Exploration: Past, Present, and Future',
    userName: 'SpaceEnthusiast',
    like: 199,
    views: 811,
    comments: 54,
    createdDate: new Date(),
    userLiked: true,
    badges: ['sport', 'fitness'],
  },
  {
    id: 10,
    content:
      'Nam sit amet erat a felis facilisis feugiat. Sed non nunc euismod, posuere mi eu, viverra dui. Mauris ut justo id enim blandit lacinia.',
    coverImage: 'kayak.jpg',
    title: 'The Benefits of Plant-Based Diets: Health and Environmental Impact',
    userName: 'GreenEater',
    like: 217,
    views: 882,
    comments: 68,
    createdDate: new Date(),
    userLiked: true,
    badges: ['sport', 'fitness'],
  },
];
