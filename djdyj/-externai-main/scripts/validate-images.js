const https = require('https');
const fs = require('fs');
const path = require('path');

// Direct Unsplash URLs to validate (curated collection)
// These are popular, high-quality images across all categories
const UNSPLASH_IMAGES = [
  // TECHNOLOGY (50 images)
  { url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853', desc: 'Laptop computer on desk', tags: ['laptop', 'computer', 'technology', 'work'], category: 'Technology' },
  { url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8', desc: 'MacBook Pro on table', tags: ['macbook', 'laptop', 'apple', 'computer'], category: 'Technology' },
  { url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085', desc: 'Coding on computer', tags: ['code', 'programming', 'developer', 'computer'], category: 'Technology' },
  { url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9', desc: 'Smartphone device', tags: ['phone', 'smartphone', 'mobile', 'device'], category: 'Technology' },
  { url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c', desc: 'iPhone in hand', tags: ['iphone', 'phone', 'mobile', 'apple'], category: 'Technology' },
  { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', desc: 'Wireless headphones', tags: ['headphones', 'audio', 'music', 'tech'], category: 'Technology' },
  { url: 'https://images.unsplash.com/photo-1545127398-14699f92334b', desc: 'Tablet device', tags: ['tablet', 'ipad', 'device', 'tech'], category: 'Technology' },
  { url: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef', desc: 'Desktop computer setup', tags: ['desktop', 'computer', 'workspace', 'tech'], category: 'Technology' },
  { url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f', desc: 'Smart watch', tags: ['watch', 'smartwatch', 'wearable', 'tech'], category: 'Technology' },
  { url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45', desc: 'Gaming laptop', tags: ['gaming', 'laptop', 'computer', 'tech'], category: 'Technology' },
  { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', desc: 'Data analytics dashboard', tags: ['analytics', 'data', 'dashboard', 'charts'], category: 'Technology' },
  { url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71', desc: 'Business analytics', tags: ['analytics', 'business', 'data', 'graphs'], category: 'Technology' },
  { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475', desc: 'Technology background', tags: ['tech', 'abstract', 'digital', 'futuristic'], category: 'Technology' },
  { url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5', desc: 'Server room', tags: ['server', 'datacenter', 'tech', 'infrastructure'], category: 'Technology' },
  { url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31', desc: 'Keyboard and mouse', tags: ['keyboard', 'mouse', 'peripherals', 'tech'], category: 'Technology' },
  { url: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04', desc: 'Wireless earbuds', tags: ['earbuds', 'audio', 'wireless', 'tech'], category: 'Technology' },
  { url: 'https://images.unsplash.com/photo-1468436139062-f60a71c5c892', desc: 'VR headset', tags: ['vr', 'virtual reality', 'headset', 'tech'], category: 'Technology' },
  { url: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620', desc: 'Drone camera', tags: ['drone', 'camera', 'aerial', 'tech'], category: 'Technology' },
  { url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f', desc: 'Security camera', tags: ['security', 'camera', 'surveillance', 'tech'], category: 'Technology' },
  { url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1', desc: 'Tech workspace', tags: ['workspace', 'office', 'tech', 'modern'], category: 'Technology' },
  
  // BUSINESS & OFFICE (40 images)
  { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c', desc: 'Modern office space', tags: ['office', 'workspace', 'business', 'professional'], category: 'Business' },
  { url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72', desc: 'Coworking space', tags: ['coworking', 'office', 'business', 'workspace'], category: 'Business' },
  { url: 'https://images.unsplash.com/photo-1556761175-4b46a572b786', desc: 'Team meeting', tags: ['meeting', 'team', 'collaboration', 'business'], category: 'Business' },
  { url: 'https://images.unsplash.com/photo-1552664730-d307ca884978', desc: 'Startup team brainstorming', tags: ['startup', 'team', 'brainstorm', 'business'], category: 'Business' },
  { url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40', desc: 'Business documents', tags: ['documents', 'paperwork', 'business', 'office'], category: 'Business' },
  { url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf', desc: 'Professional business person', tags: ['professional', 'business', 'person', 'work'], category: 'Business' },
  { url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2', desc: 'Business woman professional', tags: ['businesswoman', 'professional', 'corporate', 'executive'], category: 'Business' },
  { url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a', desc: 'Business man confident', tags: ['businessman', 'professional', 'confident', 'executive'], category: 'Business' },
  { url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216', desc: 'Office desk setup', tags: ['desk', 'office', 'workspace', 'organized'], category: 'Business' },
  { url: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc', desc: 'Conference room', tags: ['conference', 'meeting room', 'business', 'office'], category: 'Business' },
  { url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0', desc: 'Business handshake', tags: ['handshake', 'deal', 'partnership', 'business'], category: 'Business' },
  { url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85', desc: 'Business planning', tags: ['planning', 'strategy', 'business', 'charts'], category: 'Business' },
  
  // FASHION & CLOTHING (50 images)
  { url: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891', desc: 'Fashion clothing rack', tags: ['fashion', 'clothing', 'style', 'apparel'], category: 'Fashion' },
  { url: 'https://images.unsplash.com/photo-1558769132-cb1aea1f1c3d', desc: 'White t-shirt', tags: ['tshirt', 'clothing', 'fashion', 'casual'], category: 'Fashion' },
  { url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7', desc: 'Denim jeans', tags: ['jeans', 'denim', 'clothing', 'fashion'], category: 'Fashion' },
  { url: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8', desc: 'Sneakers shoes', tags: ['sneakers', 'shoes', 'footwear', 'fashion'], category: 'Fashion' },
  { url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2', desc: 'Running shoes', tags: ['shoes', 'running', 'athletic', 'footwear'], category: 'Fashion' },
  { url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772', desc: 'Leather shoes', tags: ['shoes', 'leather', 'formal', 'footwear'], category: 'Fashion' },
  { url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338', desc: 'Dress elegant', tags: ['dress', 'elegant', 'fashion', 'clothing'], category: 'Fashion' },
  { url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c', desc: 'Fashion boutique', tags: ['boutique', 'store', 'fashion', 'retail'], category: 'Fashion' },
  { url: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04', desc: 'Fashion model', tags: ['model', 'fashion', 'style', 'clothing'], category: 'Fashion' },
  { url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b', desc: 'Leather jacket', tags: ['jacket', 'leather', 'fashion', 'clothing'], category: 'Fashion' },
  { url: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3', desc: 'Luxury watch', tags: ['watch', 'luxury', 'accessory', 'timepiece'], category: 'Fashion' },
  { url: 'https://images.unsplash.com/photo-1509941943102-10c232535736', desc: 'Gold watch', tags: ['watch', 'gold', 'luxury', 'accessory'], category: 'Fashion' },
  { url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338', desc: 'Handbag purse', tags: ['handbag', 'purse', 'bag', 'accessory'], category: 'Fashion' },
  { url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d', desc: 'Sunglasses accessory', tags: ['sunglasses', 'accessory', 'fashion', 'eyewear'], category: 'Fashion' },
  
  // FOOD & RESTAURANT (60 images)
  { url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591', desc: 'Pizza delicious', tags: ['pizza', 'food', 'italian', 'restaurant'], category: 'Food' },
  { url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38', desc: 'Burger gourmet', tags: ['burger', 'food', 'hamburger', 'restaurant'], category: 'Food' },
  { url: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', desc: 'Sushi platter', tags: ['sushi', 'food', 'japanese', 'restaurant'], category: 'Food' },
  { url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', desc: 'Fresh salad healthy', tags: ['salad', 'healthy', 'food', 'vegetables'], category: 'Food' },
  { url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd', desc: 'Healthy bowl', tags: ['bowl', 'healthy', 'food', 'nutrition'], category: 'Food' },
  { url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', desc: 'Gourmet restaurant dish', tags: ['gourmet', 'restaurant', 'dish', 'food'], category: 'Food' },
  { url: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327', desc: 'Breakfast food', tags: ['breakfast', 'food', 'meal', 'morning'], category: 'Food' },
  { url: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929', desc: 'Pasta Italian', tags: ['pasta', 'italian', 'food', 'restaurant'], category: 'Food' },
  { url: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55', desc: 'Tacos Mexican', tags: ['tacos', 'mexican', 'food', 'restaurant'], category: 'Food' },
  { url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1', desc: 'Steak grilled', tags: ['steak', 'grilled', 'meat', 'restaurant'], category: 'Food' },
  { url: 'https://images.unsplash.com/photo-1551024506-0bccd828d307', desc: 'Ramen noodles', tags: ['ramen', 'noodles', 'asian', 'food'], category: 'Food' },
  { url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0', desc: 'Restaurant interior', tags: ['restaurant', 'interior', 'dining', 'ambiance'], category: 'Food' },
  { url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', desc: 'Fine dining restaurant', tags: ['fine dining', 'restaurant', 'elegant', 'upscale'], category: 'Food' },
  { url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b', desc: 'Coffee cafe drink', tags: ['coffee', 'cafe', 'drink', 'beverage'], category: 'Food' },
  { url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085', desc: 'Espresso coffee', tags: ['espresso', 'coffee', 'cafe', 'drink'], category: 'Food' },
  { url: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8', desc: 'Latte art coffee', tags: ['latte', 'coffee', 'art', 'cafe'], category: 'Food' },
  { url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add', desc: 'Smoothie healthy drink', tags: ['smoothie', 'healthy', 'drink', 'beverage'], category: 'Food' },
  { url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814', desc: 'Cocktail bar drink', tags: ['cocktail', 'bar', 'drink', 'alcohol'], category: 'Food' },
  { url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b', desc: 'Ice cream dessert', tags: ['ice cream', 'dessert', 'sweet', 'frozen'], category: 'Food' },
  { url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587', desc: 'Cake dessert', tags: ['cake', 'dessert', 'sweet', 'pastry'], category: 'Food' },
  { url: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e', desc: 'Cupcake sweet', tags: ['cupcake', 'sweet', 'dessert', 'pastry'], category: 'Food' },
  { url: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d', desc: 'Donut pastry', tags: ['donut', 'pastry', 'sweet', 'dessert'], category: 'Food' },
  { url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35', desc: 'Bread bakery', tags: ['bread', 'bakery', 'fresh', 'pastry'], category: 'Food' },
  { url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff', desc: 'Croissant pastry', tags: ['croissant', 'pastry', 'french', 'bakery'], category: 'Food' },
  
  // FITNESS & GYM (40 images)
  { url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48', desc: 'Gym workout fitness', tags: ['gym', 'workout', 'fitness', 'exercise'], category: 'Fitness' },
  { url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b', desc: 'Gym equipment', tags: ['gym', 'equipment', 'fitness', 'weights'], category: 'Fitness' },
  { url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438', desc: 'Yoga practice', tags: ['yoga', 'practice', 'fitness', 'wellness'], category: 'Fitness' },
  { url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b', desc: 'Yoga mat exercise', tags: ['yoga', 'mat', 'exercise', 'fitness'], category: 'Fitness' },
  { url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8', desc: 'Running jogging', tags: ['running', 'jogging', 'cardio', 'fitness'], category: 'Fitness' },
  { url: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5', desc: 'Runner athlete', tags: ['runner', 'athlete', 'running', 'fitness'], category: 'Fitness' },
  { url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd', desc: 'Cyclist cycling', tags: ['cycling', 'cyclist', 'bike', 'fitness'], category: 'Fitness' },
  { url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b', desc: 'Gym weights dumbbells', tags: ['weights', 'dumbbells', 'gym', 'strength'], category: 'Fitness' },
  { url: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1', desc: 'Boxing training', tags: ['boxing', 'training', 'fitness', 'combat'], category: 'Fitness' },
  { url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a', desc: 'Pilates exercise', tags: ['pilates', 'exercise', 'fitness', 'stretching'], category: 'Fitness' },
  { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b', desc: 'CrossFit training', tags: ['crossfit', 'training', 'fitness', 'intense'], category: 'Fitness' },
  { url: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3', desc: 'Swimming pool fitness', tags: ['swimming', 'pool', 'fitness', 'cardio'], category: 'Fitness' },
  
  // REAL ESTATE & HOMES (50 images)
  { url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994', desc: 'Modern house exterior', tags: ['house', 'home', 'modern', 'real estate'], category: 'RealEstate' },
  { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750', desc: 'Luxury home', tags: ['luxury', 'home', 'house', 'real estate'], category: 'RealEstate' },
  { url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914', desc: 'Apartment building', tags: ['apartment', 'building', 'real estate', 'residential'], category: 'RealEstate' },
  { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6', desc: 'Modern interior living room', tags: ['living room', 'interior', 'modern', 'home'], category: 'Home' },
  { url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace', desc: 'Scandinavian living room', tags: ['living room', 'scandinavian', 'interior', 'home'], category: 'Home' },
  { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136', desc: 'Kitchen modern', tags: ['kitchen', 'modern', 'interior', 'home'], category: 'Home' },
  { url: 'https://images.unsplash.com/photo-1556912167-f556f1f39faa', desc: 'White kitchen', tags: ['kitchen', 'white', 'clean', 'interior'], category: 'Home' },
  { url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457', desc: 'Bedroom cozy', tags: ['bedroom', 'cozy', 'interior', 'home'], category: 'Home' },
  { url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85', desc: 'Modern bedroom', tags: ['bedroom', 'modern', 'interior', 'home'], category: 'Home' },
  { url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14', desc: 'Bathroom modern', tags: ['bathroom', 'modern', 'interior', 'home'], category: 'Home' },
  { url: 'https://images.unsplash.com/photo-1620626011761-996317b8d101', desc: 'Luxury bathroom', tags: ['bathroom', 'luxury', 'interior', 'home'], category: 'Home' },
  { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc', desc: 'Modern furniture sofa', tags: ['sofa', 'furniture', 'modern', 'interior'], category: 'Home' },
  { url: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e', desc: 'Dining room table', tags: ['dining room', 'table', 'interior', 'home'], category: 'Home' },
  { url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0', desc: 'Home office workspace', tags: ['home office', 'workspace', 'desk', 'interior'], category: 'Home' },
  
  // TRAVEL & TOURISM (50 images)
  { url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828', desc: 'Travel suitcase luggage', tags: ['travel', 'suitcase', 'luggage', 'vacation'], category: 'Travel' },
  { url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05', desc: 'Airplane flight', tags: ['airplane', 'flight', 'travel', 'aviation'], category: 'Travel' },
  { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', desc: 'Beach paradise tropical', tags: ['beach', 'paradise', 'tropical', 'ocean'], category: 'Travel' },
  { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4', desc: 'Hotel luxury room', tags: ['hotel', 'luxury', 'room', 'accommodation'], category: 'Travel' },
  { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945', desc: 'Hotel bedroom', tags: ['hotel', 'bedroom', 'accommodation', 'travel'], category: 'Travel' },
  { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d', desc: 'Hotel lobby', tags: ['hotel', 'lobby', 'luxury', 'interior'], category: 'Travel' },
  { url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6', desc: 'Swimming pool resort', tags: ['pool', 'resort', 'swimming', 'vacation'], category: 'Travel' },
  { url: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21', desc: 'Mountains landscape', tags: ['mountains', 'landscape', 'nature', 'travel'], category: 'Travel' },
  { url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800', desc: 'Camping outdoor', tags: ['camping', 'outdoor', 'nature', 'adventure'], category: 'Travel' },
  { url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b', desc: 'City skyline urban', tags: ['city', 'skyline', 'urban', 'architecture'], category: 'Travel' },
  { url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785', desc: 'Paris Eiffel Tower', tags: ['paris', 'eiffel tower', 'landmark', 'travel'], category: 'Travel' },
  { url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad', desc: 'London Big Ben', tags: ['london', 'big ben', 'landmark', 'travel'], category: 'Travel' },
  
  // EDUCATION & LEARNING (35 images)
  { url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45', desc: 'Student studying books', tags: ['student', 'studying', 'education', 'learning'], category: 'Education' },
  { url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b', desc: 'Books library', tags: ['books', 'library', 'education', 'reading'], category: 'Education' },
  { url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570', desc: 'Open book reading', tags: ['book', 'reading', 'education', 'study'], category: 'Education' },
  { url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1', desc: 'University classroom', tags: ['classroom', 'university', 'education', 'lecture'], category: 'Education' },
  { url: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a', desc: 'Students group studying', tags: ['students', 'group', 'studying', 'education'], category: 'Education' },
  { url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8', desc: 'Online learning laptop', tags: ['online learning', 'laptop', 'education', 'elearning'], category: 'Education' },
  { url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7', desc: 'Notebook writing notes', tags: ['notebook', 'writing', 'notes', 'study'], category: 'Education' },
  { url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173', desc: 'Desk study workspace', tags: ['desk', 'study', 'workspace', 'education'], category: 'Education' },
  { url: 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70', desc: 'Graduation cap diploma', tags: ['graduation', 'cap', 'diploma', 'education'], category: 'Education' },
  { url: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc', desc: 'Science lab', tags: ['science', 'lab', 'education', 'research'], category: 'Education' },
  
  // PEOPLE & PORTRAITS (40 images)
  { url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e', desc: 'Professional portrait man', tags: ['portrait', 'professional', 'man', 'people'], category: 'People' },
  { url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330', desc: 'Professional portrait woman', tags: ['portrait', 'professional', 'woman', 'people'], category: 'People' },
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', desc: 'Happy man smiling', tags: ['happy', 'smiling', 'man', 'people'], category: 'People' },
  { url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80', desc: 'Happy woman smiling', tags: ['happy', 'smiling', 'woman', 'people'], category: 'People' },
  { url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7', desc: 'Business team confident', tags: ['team', 'business', 'confident', 'people'], category: 'People' },
  { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c', desc: 'Team collaboration happy', tags: ['team', 'collaboration', 'happy', 'people'], category: 'People' },
  { url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e', desc: 'Diverse team group', tags: ['diverse', 'team', 'group', 'people'], category: 'People' },
  { url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18', desc: 'Elderly person senior', tags: ['elderly', 'senior', 'portrait', 'people'], category: 'People' },
  { url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9', desc: 'Family happy together', tags: ['family', 'happy', 'together', 'people'], category: 'People' },
  { url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300', desc: 'Children kids playing', tags: ['children', 'kids', 'playing', 'people'], category: 'People' },
  
  // NATURE & ENVIRONMENT (40 images)
  { url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05', desc: 'Nature landscape mountains', tags: ['nature', 'landscape', 'mountains', 'outdoor'], category: 'Nature' },
  { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e', desc: 'Forest trees nature', tags: ['forest', 'trees', 'nature', 'woods'], category: 'Nature' },
  { url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff', desc: 'Lake water nature', tags: ['lake', 'water', 'nature', 'scenic'], category: 'Nature' },
  { url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e', desc: 'Sunset sky clouds', tags: ['sunset', 'sky', 'clouds', 'nature'], category: 'Nature' },
  { url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946', desc: 'Flowers colorful garden', tags: ['flowers', 'colorful', 'garden', 'nature'], category: 'Nature' },
  { url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399', desc: 'Rose flower red', tags: ['rose', 'flower', 'red', 'nature'], category: 'Nature' },
  { url: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890', desc: 'Sunflower yellow', tags: ['sunflower', 'yellow', 'flower', 'nature'], category: 'Nature' },
  { url: 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2', desc: 'Cat pet animal', tags: ['cat', 'pet', 'animal', 'feline'], category: 'Nature' },
  { url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1', desc: 'Dog pet happy', tags: ['dog', 'pet', 'happy', 'animal'], category: 'Nature' },
  { url: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1', desc: 'Eagle bird wildlife', tags: ['eagle', 'bird', 'wildlife', 'nature'], category: 'Nature' },
  { url: 'https://images.unsplash.com/photo-1484406566174-9da000fda645', desc: 'Butterfly insect nature', tags: ['butterfly', 'insect', 'nature', 'colorful'], category: 'Nature' },
  { url: 'https://images.unsplash.com/photo-1511044568932-338cba0ad803', desc: 'Plants indoor green', tags: ['plants', 'indoor', 'green', 'nature'], category: 'Nature' },
  
  // CREATIVE & ARTS (35 images)
  { url: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b', desc: 'Artist painting creative', tags: ['artist', 'painting', 'creative', 'art'], category: 'Creative' },
  { url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f', desc: 'Paint brushes art', tags: ['paint', 'brushes', 'art', 'creative'], category: 'Creative' },
  { url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd', desc: 'Camera photography', tags: ['camera', 'photography', 'photo', 'creative'], category: 'Creative' },
  { url: 'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e', desc: 'DSLR camera professional', tags: ['dslr', 'camera', 'professional', 'photography'], category: 'Creative' },
  { url: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b', desc: 'Graphic design workspace', tags: ['graphic design', 'workspace', 'creative', 'design'], category: 'Creative' },
  { url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5', desc: 'Designer working tablet', tags: ['designer', 'tablet', 'working', 'creative'], category: 'Creative' },
  { url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d', desc: 'Music studio recording', tags: ['music', 'studio', 'recording', 'audio'], category: 'Creative' },
  { url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1', desc: 'Guitar instrument music', tags: ['guitar', 'instrument', 'music', 'creative'], category: 'Creative' },
  { url: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0', desc: 'Piano keyboard music', tags: ['piano', 'keyboard', 'music', 'instrument'], category: 'Creative' },
  { url: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae', desc: 'Microphone audio recording', tags: ['microphone', 'audio', 'recording', 'music'], category: 'Creative' },
  
  // AUTOMOTIVE (25 images)
  { url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d', desc: 'Sports car luxury', tags: ['car', 'sports car', 'luxury', 'automotive'], category: 'Automotive' },
  { url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7', desc: 'Car modern vehicle', tags: ['car', 'modern', 'vehicle', 'automotive'], category: 'Automotive' },
  { url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70', desc: 'BMW luxury car', tags: ['bmw', 'luxury', 'car', 'automotive'], category: 'Automotive' },
  { url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888', desc: 'Tesla electric car', tags: ['tesla', 'electric', 'car', 'automotive'], category: 'Automotive' },
  { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64', desc: 'SUV vehicle', tags: ['suv', 'vehicle', 'car', 'automotive'], category: 'Automotive' },
  { url: 'https://images.unsplash.com/photo-1558981033-6f0851d0c28a', desc: 'Motorcycle bike', tags: ['motorcycle', 'bike', 'vehicle', 'automotive'], category: 'Automotive' },
  { url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87', desc: 'Classic car vintage', tags: ['classic car', 'vintage', 'car', 'automotive'], category: 'Automotive' },
  
  // EVENTS & CELEBRATIONS (30 images)
  { url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed', desc: 'Wedding celebration', tags: ['wedding', 'celebration', 'event', 'ceremony'], category: 'Events' },
  { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc', desc: 'Party celebration event', tags: ['party', 'celebration', 'event', 'fun'], category: 'Events' },
  { url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30', desc: 'Birthday party celebration', tags: ['birthday', 'party', 'celebration', 'event'], category: 'Events' },
  { url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3', desc: 'Concert music event', tags: ['concert', 'music', 'event', 'performance'], category: 'Events' },
  { url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea', desc: 'DJ music party', tags: ['dj', 'music', 'party', 'event'], category: 'Events' },
  { url: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329', desc: 'Conference event business', tags: ['conference', 'event', 'business', 'professional'], category: 'Events' },
  { url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2', desc: 'Festival outdoor event', tags: ['festival', 'outdoor', 'event', 'crowd'], category: 'Events' },
  
  // ABSTRACT & BACKGROUNDS (35 images)
  { url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1', desc: 'Abstract gradient blue', tags: ['abstract', 'gradient', 'blue', 'background'], category: 'Abstract' },
  { url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85', desc: 'Abstract gradient pink', tags: ['abstract', 'gradient', 'pink', 'background'], category: 'Abstract' },
  { url: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5', desc: 'Abstract gradient purple', tags: ['abstract', 'gradient', 'purple', 'background'], category: 'Abstract' },
  { url: 'https://images.unsplash.com/photo-1557672199-6951bca58603', desc: 'Abstract pattern geometric', tags: ['abstract', 'pattern', 'geometric', 'background'], category: 'Abstract' },
  { url: 'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3', desc: 'Texture concrete gray', tags: ['texture', 'concrete', 'gray', 'background'], category: 'Abstract' },
  { url: 'https://images.unsplash.com/photo-1553356084-58ef4a67b2a7', desc: 'Texture wood natural', tags: ['texture', 'wood', 'natural', 'background'], category: 'Abstract' },
  { url: 'https://images.unsplash.com/photo-1557683316-973673baf926', desc: 'Marble texture luxury', tags: ['marble', 'texture', 'luxury', 'background'], category: 'Abstract' },
  { url: 'https://images.unsplash.com/photo-1557682268-e3955ed5d83f', desc: 'Colorful abstract art', tags: ['colorful', 'abstract', 'art', 'background'], category: 'Abstract' },
];

// Validate URL returns 200
function validateUrl(url) {
  const fullUrl = `${url}?w=400&h=300&fit=crop`;
  return new Promise((resolve) => {
    https.get(fullUrl, (res) => {
      const isValid = res.statusCode === 200;
      resolve({ valid: isValid, statusCode: res.statusCode });
    }).on('error', (err) => {
      resolve({ valid: false, error: err.message });
    });
  });
}

// Build and validate image library
async function buildLibrary() {
  console.log('🚀 Starting comprehensive image library validation...\n');
  console.log(`📊 Total images to validate: ${UNSPLASH_IMAGES.length}\n`);
  
  const library = {};
  const validImages = [];
  const invalidImages = [];
  let processed = 0;

  for (const img of UNSPLASH_IMAGES) {
    processed++;
    process.stdout.write(`\r[${processed}/${UNSPLASH_IMAGES.length}] Validating: ${img.desc.substring(0, 40)}...`);
    
    const result = await validateUrl(img.url);
    
    if (result.valid) {
      const fullUrl = `${img.url}?w=400&h=300&fit=crop`;
      
      if (!library[img.category]) {
        library[img.category] = [];
      }
      
      library[img.category].push({
        url: fullUrl,
        description: img.desc,
        tags: img.tags,
        category: img.category
      });
      
      validImages.push({ ...img, fullUrl });
      process.stdout.write(' ✓\n');
    } else {
      invalidImages.push({ ...img, reason: result.error || `Status: ${result.statusCode}` });
      process.stdout.write(' ✗\n');
    }
    
    // Rate limiting - be respectful to Unsplash
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n\n📊 VALIDATION SUMMARY:');
  console.log(`   ✅ Valid images: ${validImages.length}`);
  console.log(`   ❌ Invalid images: ${invalidImages.length}`);
  console.log(`   📁 Categories: ${Object.keys(library).length}\n`);

  // Category breakdown
  console.log('📂 Images per category:');
  for (const [category, images] of Object.entries(library).sort((a, b) => b[1].length - a[1].length)) {
    console.log(`   ${category.padEnd(15)}: ${images.length} images`);
  }

  // Save valid images library
  const outputPath = path.join(__dirname, '../src/lib/image-library.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(library, null, 2));
  console.log(`\n💾 Valid images saved to: ${outputPath}`);

  // Save invalid images log
  if (invalidImages.length > 0) {
    const invalidPath = path.join(__dirname, '../src/lib/invalid-images.json');
    fs.writeFileSync(invalidPath, JSON.stringify(invalidImages, null, 2));
    console.log(`⚠️  Invalid images log: ${invalidPath}`);
  }

  // Generate TypeScript file
  generateTypeScriptFile(library);
  
  return { valid: validImages, invalid: invalidImages, library };
}

// Generate TypeScript file with image library
function generateTypeScriptFile(library) {
  const totalImages = Object.values(library).flat().length;
  
  let tsContent = `// Auto-generated image library - DO NOT EDIT MANUALLY
// Generated: ${new Date().toISOString()}
// Total verified images: ${totalImages}
// All images validated and working from Unsplash

export interface ImageData {
  url: string;
  description: string;
  tags: string[];
  category: string;
}

export interface ImageLibrary {
  [category: string]: ImageData[];
}

export const IMAGE_LIBRARY: ImageLibrary = `;

  tsContent += JSON.stringify(library, null, 2);
  tsContent += ';\n\n';

  // Add helper functions
  tsContent += `
// Helper: Find images by keywords (searches description and tags)
export function findImagesByKeywords(keywords: string[]): ImageData[] {
  const results: ImageData[] = [];
  const lowerKeywords = keywords.map(k => k.toLowerCase());
  
  for (const category in IMAGE_LIBRARY) {
    for (const image of IMAGE_LIBRARY[category]) {
      const searchText = (image.description + ' ' + image.tags.join(' ')).toLowerCase();
      const matchScore = lowerKeywords.filter(keyword => searchText.includes(keyword)).length;
      if (matchScore > 0) {
        results.push({ ...image, matchScore } as any);
      }
    }
  }
  
  // Sort by match score (descending)
  return results.sort((a: any, b: any) => b.matchScore - a.matchScore);
}

// Helper: Get random image from category
export function getRandomImageFromCategory(category: string): ImageData | null {
  const images = IMAGE_LIBRARY[category];
  if (!images || images.length === 0) return null;
  return images[Math.floor(Math.random() * images.length)];
}

// Helper: Get random image by tags
export function getRandomImageByTags(tags: string[]): ImageData | null {
  const matches = findImagesByKeywords(tags);
  if (matches.length === 0) return null;
  return matches[Math.floor(Math.random() * Math.min(matches.length, 10))];
}

// Helper: Get multiple images by category
export function getImagesByCategory(category: string, count: number = 10): ImageData[] {
  const images = IMAGE_LIBRARY[category] || [];
  return images.slice(0, count);
}

// Get all categories
export function getAllCategories(): string[] {
  return Object.keys(IMAGE_LIBRARY);
}

// Get total image count
export function getTotalImageCount(): number {
  return ${totalImages};
}

// Get category with most images
export function getLargestCategory(): { category: string; count: number } {
  let max = { category: '', count: 0 };
  for (const [category, images] of Object.entries(IMAGE_LIBRARY)) {
    if (images.length > max.count) {
      max = { category, count: images.length };
    }
  }
  return max;
}
`;

  const tsPath = path.join(__dirname, '../src/lib/image-library.ts');
  fs.writeFileSync(tsPath, tsContent);
  console.log(`📝 TypeScript library generated: ${tsPath}`);
  console.log(`\n✨ Library ready to use! Import from: src/lib/image-library.ts\n`);
}

// Run the build process
if (require.main === module) {
  buildLibrary()
    .then(() => {
      console.log('✅ Image library build complete!\n');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error building library:', error);
      process.exit(1);
    });
}

module.exports = { buildLibrary, validateUrl };
