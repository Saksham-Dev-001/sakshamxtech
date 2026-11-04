import { 
  SiteSettings, 
  ArcadeSolution, 
  UnstopProblem, 
  BlogPost, 
  Opportunity, 
  SwagItem, 
  CLesson, 
  ResourceItem, 
  ArcadeCalculatorConfig,
  YouTubeVideoItem,
  LeaderboardUser,
  AnalyticsMetric
} from '../types';
import { getDateIsoDaysAgo } from '../utils/realTime';

export const initialSiteSettings: SiteSettings = {
  brandName: 'SakshamXTech',
  tagline: 'Code. Cloud. Grow.',
  creatorName: 'Saksham Sharma',
  creatorTitle: 'Founder of SakshamXTech | Cloud Architect & Tech Content Creator',
  creatorBio: 'Passionate developer and Google Developer community member empowering 50,000+ students with Google Cloud Arcade solutions, daily Unstop POTD walkthroughs, in-depth C Academy lectures, and verified swag opportunities.',
  creatorAvatarUrl: '/assets/branding/saksham_portrait.png',
  adminEmail: 'hutch.saksham@gmail.com',
  socialLinks: {
    youtube: 'https://youtube.com/@sakshamxtech',
    telegram: 'https://t.me/SakshamXTech',
    whatsapp: 'https://chat.whatsapp.com/SakshamXTechCommunity',
    discord: 'https://discord.gg/sakshamxtech',
    linkedin: 'https://linkedin.com/in/saksham-sharma-tech',
    instagram: 'https://instagram.com/sakshamxtech',
    github: 'https://github.com/sakshamxtech',
    twitter: 'https://twitter.com/sakshamxtech',
  },
  statistics: {
    youtubeSubscribers: '13.5K+',
    youtubeVideos: '350+',
    technicalSolutions: '450+',
    publishedBlogs: '120+',
    opportunitiesListed: '85+',
    studentCommunity: '50,000+',
  },
  announcement: {
    enabled: true,
    badgeText: 'ARCADE 2026',
    text: 'Google Cloud Arcade 2026 Season is Live! Watch lab walkthroughs, calculate points & claim swags.',
    linkUrl: '/google-arcade',
  },
  adsConfig: {
    enabled: false,
    headerBanner: false,
    sidebarBanner: false,
    inArticleBanner: false,
    adClient: 'ca-pub-0000000000000000',
  },
};

export const initialArcadeCalculatorConfig: ArcadeCalculatorConfig = {
  pointsPerSkillBadge: 1,
  pointsPerTriviaGame: 1,
  pointsPerLabCompletion: 0.5,
  tiers: [
    {
      tierName: 'Standard Tier',
      minPoints: 10,
      swags: ['Google Cloud Arcade T-Shirt', 'Collector Stickers & Pin Pack', 'Arcade Pen & Notebook'],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      tierName: 'Advanced Tier',
      minPoints: 20,
      swags: ['Insulated LED Thermal Bottle', 'Arcade Laptop Sleeve', 'All Standard Tier Swags'],
      color: 'from-indigo-500 to-purple-500',
    },
    {
      tierName: 'Premium Tier',
      minPoints: 30,
      swags: ['Arcade Heavyweight Embroidered Hoodie', 'Water-Resistant Backpack', 'Smart Tumbler'],
      color: 'from-amber-500 to-orange-500',
    },
    {
      tierName: 'Champion Tier',
      minPoints: 45,
      swags: ['Arcade Weather-Shield Bomber Jacket', 'Complete Champion Swag Box', 'Wireless Charging Station', 'VIP Trophy & Badge'],
      color: 'from-emerald-400 to-teal-500',
    },
  ],
};

export const initialYouTubeVideos: YouTubeVideoItem[] = [
  {
    id: 'yt-1',
    videoId: 'InMCIxL2Azk',
    title: 'Google Cloud Arcade 2026: Master Guide to Earn Maximum Points & Claim Champion Swag',
    description: 'Complete breakdown of Google Cloud Arcade 2026 season. Learn how Skill Badges, Trivia games, and Facilitator Cohorts calculate into final prize points.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=640&q=80',
    publishedAt: '2 days ago',
    duration: '18:45',
    views: '24.5K',
    category: 'Google Cloud',
  },
  {
    id: 'yt-2',
    videoId: '9X0JToHJ2to',
    title: 'Unstop 30 Days POTD: Subarray Sum Equals K (C, C++, Java, Python, JS Solutions)',
    description: 'Day-by-day Unstop Problem of the Day walkthrough with optimal O(n) prefix sum and hash map approach in all standard languages.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=640&q=80',
    publishedAt: 'Yesterday',
    duration: '14:20',
    views: '12.8K',
    category: 'Unstop',
  },
  {
    id: 'yt-3',
    videoId: 'sakshamxtech-arcade-swags-unboxing',
    title: 'Google Cloud Arcade Swag Unboxing: Weather-Shield Jacket, Smart Bottle & Backpack!',
    description: 'Official unboxing of the Google Cloud Arcade rewards. Reviewing material quality, delivery timeline, and claim process.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=640&q=80',
    publishedAt: '5 days ago',
    duration: '15:10',
    views: '38.4K',
    category: 'Tech Swags',
  },
  {
    id: 'yt-4',
    videoId: 'ZnL2ZK0-KHg',
    title: 'GSP007 Solution: Set Up Network and HTTP Load Balancers in 5 Minutes (Cloud Shell)',
    description: 'Fast, error-free walkthrough of GSP007 with target pools, health checks, forwarding rules, and instant score verification.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=640&q=80',
    publishedAt: '1 week ago',
    duration: '09:40',
    views: '41.2K',
    category: 'Google Cloud',
  },
  {
    id: 'yt-5',
    videoId: 'ZnL2ZK0-KHg',
    title: 'Day 1: C Programming Complete Lecture Series | GCC Pipeline, Memory Stack & Heap',
    description: 'First lecture of SakshamXTech C Academy. Systems programming from scratch: preprocessing, compilation, assembly, and linking.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=640&q=80',
    publishedAt: '2 weeks ago',
    duration: '32:15',
    views: '29.7K',
    category: 'C Programming',
  },
  {
    id: 'yt-6',
    videoId: 'sakshamxtech-arcade-insider-mail',
    title: 'Arcade Insider Mail Explained: Point Calculation, Milestone Checks & Missing Points Fix',
    description: 'Everything you need to know about monthly Arcade Insider emails, badge verification on Skills Boost, and troubleshooting missing point credits.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=640&q=80',
    publishedAt: '3 weeks ago',
    duration: '11:55',
    views: '19.4K',
    category: 'Google Cloud',
  },
];

export const initialArcadeSolutions: ArcadeSolution[] = [
  {
    id: 'arc-gsp1234',
    slug: 'implement-load-balancing-with-cloud-run',
    title: 'Implement Load Balancing with Cloud Run',
    labCode: 'GSP1234',
    difficulty: 'Beginner',
    durationMinutes: 6,
    category: 'Arcade Lab',
    badgeTitle: 'Serverless Cloud Run Architecture',
    badgeImageUrl: '/assets/branding/arcade_skill_badges.png',
    description: 'Learn how to set up an external HTTP(S) Load Balancer in front of Google Cloud Run serverless microservices with serverless Network Endpoint Groups (NEGs).',
    prerequisites: ['Basic Google Cloud Console knowledge', 'Cloud Run fundamentals'],
    pointsAwarded: 1,
    youtubeVideoId: 'zN8XsZ4Cg2M',
    lastUpdated: '2026-11-01',
    isPublished: true,
    steps: [
      {
        stepNumber: 1,
        title: 'Enable Cloud Run & Compute Engine APIs',
        description: 'Initialize Cloud Shell and activate required Google Cloud service APIs.',
        command: 'gcloud services enable run.googleapis.com compute.googleapis.com',
      },
      {
        stepNumber: 2,
        title: 'Deploy sample Cloud Run application',
        description: 'Deploy a lightweight containerized service with public access.',
        command: 'gcloud run deploy sx-hello --image gcr.io/cloudrun/hello --region us-central1 --allow-unauthenticated',
      },
      {
        stepNumber: 3,
        title: 'Create Serverless NEG and Load Balancer',
        description: 'Connect Cloud Run backend to Google Cloud global HTTP load balancing infrastructure.',
        command: 'gcloud compute network-endpoint-groups create sx-cloudrun-neg --region=us-central1 --network-endpoint-type=serverless --cloud-run-service=sx-hello',
      },
    ],
    importantCommands: [
      'gcloud compute network-endpoint-groups list',
      'gcloud run services list',
    ],
  },
  {
    id: 'arc-gsp1107',
    slug: 'deploy-a-containerized-application-on-gke',
    title: 'Deploy a Containerized Application on GKE',
    labCode: 'GSP1107',
    difficulty: 'Intermediate',
    durationMinutes: 8,
    category: 'Skill Badge',
    badgeTitle: 'Google Kubernetes Engine Architecture',
    badgeImageUrl: '/assets/branding/arcade_1.png',
    description: 'Provision a production-ready GKE cluster, build container artifacts with Cloud Build, and deploy multi-replica workloads with automated health checks.',
    prerequisites: ['Docker basics', 'Kubernetes core concepts'],
    pointsAwarded: 1,
    youtubeVideoId: 'zN8XsZ4Cg2M',
    lastUpdated: '2026-10-31',
    isPublished: true,
    steps: [
      {
        stepNumber: 1,
        title: 'Create GKE Autopilot Cluster',
        description: 'Provision an automated Kubernetes cluster in us-central1.',
        command: 'gcloud container clusters create-auto sx-cluster --region us-central1',
      },
      {
        stepNumber: 2,
        title: 'Deploy container workload to GKE',
        description: 'Create a Deployment and expose it via a LoadBalancer Service.',
        command: 'kubectl create deployment sx-web --image=nginx:latest\nkubectl expose deployment sx-web --type=LoadBalancer --port 80 --target-port 80',
      },
    ],
    importantCommands: [
      'kubectl get pods -o wide',
      'kubectl get services',
    ],
  },
  {
    id: 'arc-gsp1099',
    slug: 'build-and-deploy-a-serverless-app',
    title: 'Build and Deploy a Serverless App',
    labCode: 'GSP1099',
    difficulty: 'Beginner',
    durationMinutes: 7,
    category: 'Arcade Lab',
    badgeTitle: 'Eventarc and Cloud Functions Gen 2',
    badgeImageUrl: '/assets/branding/arcade_skill_badges.png',
    description: 'Trigger asynchronous Cloud Functions on Cloud Storage uploads using Eventarc routing and process real-time metadata.',
    prerequisites: ['Cloud Storage knowledge', 'Python or Node basics'],
    pointsAwarded: 1,
    youtubeVideoId: 'zN8XsZ4Cg2M',
    lastUpdated: '2026-10-29',
    isPublished: true,
    steps: [
      {
        stepNumber: 1,
        title: 'Create Cloud Storage Bucket',
        description: 'Create a globally unique storage bucket for event ingress.',
        command: 'gsutil mb -l us-central1 gs://$GOOGLE_CLOUD_PROJECT-media-bucket',
      },
      {
        stepNumber: 2,
        title: 'Deploy Cloud Function Gen 2 with Storage Trigger',
        description: 'Deploy an automated Python background worker on object finalized events.',
        command: 'gcloud functions deploy sx-process-media --gen2 --runtime=python311 --trigger-event-filters="type=google.cloud.storage.object.v1.finalized" --trigger-event-filters="bucket=$GOOGLE_CLOUD_PROJECT-media-bucket" --region=us-central1',
      },
    ],
    importantCommands: [
      'gcloud functions list',
      'gsutil ls gs://$GOOGLE_CLOUD_PROJECT-media-bucket',
    ],
  },
  {
    id: 'arc-1',
    slug: 'set-up-network-and-http-load-balancers',
    title: 'Set Up Network and HTTP Load Balancers',
    labCode: 'GSP007',
    difficulty: 'Intermediate',
    durationMinutes: 45,
    category: 'Skill Badge',
    badgeTitle: 'Build and Secure Networks in Google Cloud',
    badgeImageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=200&q=80',
    description: 'Learn how to configure regional network load balancers and global HTTP load balancers for applications running on Compute Engine virtual machines.',
    prerequisites: ['Basic Cloud Shell familiarity', 'Understanding of Compute Engine instances'],
    pointsAwarded: 1,
    youtubeVideoId: 'ZnL2ZK0-KHg',
    lastUpdated: '2026-10-28',
    isPublished: true,
    steps: [
      {
        stepNumber: 1,
        title: 'Set the default region and zone',
        description: 'Initialize Cloud Shell and set your project environment variables for us-central1.',
        command: 'gcloud config set compute/region us-central1\ngcloud config set compute/zone us-central1-a',
        note: 'Always verify the assigned zone from your lab credentials panel.',
      },
      {
        stepNumber: 2,
        title: 'Create multiple web server instances',
        description: 'Spin up 3 Nginx web servers with startup scripts to demonstrate load distribution.',
        command: 'gcloud compute instances create www1 www2 www3 \\\n  --zone=us-central1-a \\\n  --tags=network-lb-tag \\\n  --metadata=startup-script="#! /bin/bash\n    apt-get update\n    apt-get install -y apache2\n    systemctl start apache2\n    echo \\"<h1>Welcome to $(hostname)</h1>\\" > /var/www/html/index.html"',
      },
      {
        stepNumber: 3,
        title: 'Configure the load balancing service',
        description: 'Create a static external IP address and define target pools for your virtual machines.',
        command: 'gcloud compute addresses create lb-ipv4-1 --region us-central1\ngcloud compute target-pools create www-pool --region us-central1\ngcloud compute target-pools add-instances www-pool --instances www1,www2,www3 --zone us-central1-a',
      },
      {
        stepNumber: 4,
        title: 'Verify traffic distribution',
        description: 'Send test HTTP requests to verify that incoming traffic cycles evenly between www1, www2, and www3.',
        command: 'IP_ADDR=$(gcloud compute addresses describe lb-ipv4-1 --region us-central1 --format="value(address)")\nfor i in {1..5}; do curl -m1 $IP_ADDR; done',
      },
    ],
    importantCommands: [
      'gcloud compute firewall-rules create www-firewall-network-lb --target-tags network-lb-tag --allow tcp:80',
      'gcloud compute forwarding-rules create www-rule --region us-central1 --ports 80 --address lb-ipv4-1 --target-pool www-pool',
    ],
  },
  {
    id: 'arc-2',
    slug: 'cloud-armor-ddos-protection-and-waf',
    title: 'Deploy Cloud Armor with Rate Limiting & WAF Defense',
    labCode: 'GSP244',
    difficulty: 'Advanced',
    durationMinutes: 50,
    category: 'Skill Badge',
    badgeTitle: 'Security Best Practices in Google Cloud',
    badgeImageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=200&q=80',
    description: 'Configure Cloud Armor security policies, implement IP denylists, SQL injection protection, and Layer 7 DDoS mitigation rules.',
    prerequisites: ['HTTP Load Balancer knowledge', 'VPC Networking'],
    pointsAwarded: 1,
    youtubeVideoId: 'InMCIxL2Azk',
    lastUpdated: '2026-10-25',
    isPublished: true,
    steps: [
      {
        stepNumber: 1,
        title: 'Create Cloud Armor security policy',
        description: 'Provision a new Cloud Armor policy in standard mode with default allow.',
        command: 'gcloud compute security-policies create block-siege-policy \\\n  --description "Security policy to mitigate Layer 7 volumetric attacks"',
      },
      {
        stepNumber: 2,
        title: 'Add SQL injection prevention rules',
        description: 'Leverage pre-configured WAF CRS rulesets for owasp-crs-v030301-id942-sqli.',
        command: 'gcloud compute security-policies rules create 1000 \\\n  --security-policy block-siege-policy \\\n  --expression "evaluatePreconfiguredExpr(\'sqli-stable\')" \\\n  --action "deny-403"',
      },
      {
        stepNumber: 3,
        title: 'Attach policy to Backend Service',
        description: 'Link the Cloud Armor rule to your HTTP load balancer backend service.',
        command: 'gcloud compute backend-services update web-backend-service \\\n  --security-policy block-siege-policy \\\n  --global',
      },
    ],
    importantCommands: [
      'gcloud compute security-policies list',
      'curl -i "http://$LB_IP/?id=1\'%20OR%20\'1\'=\'1"',
    ],
  },
  {
    id: 'arc-3',
    slug: 'deploy-kubernetes-engine-clusters',
    title: 'Deploy and Scale Microservices on Google Kubernetes Engine',
    labCode: 'GSP021',
    difficulty: 'Intermediate',
    durationMinutes: 40,
    category: 'Arcade Lab',
    badgeTitle: 'Deploy to Kubernetes in Google Cloud',
    description: 'Create GKE Autopilot clusters, deploy containerized Node.js microservices, and configure horizontal pod autoscalers.',
    prerequisites: ['Docker basics', 'Cloud Shell'],
    pointsAwarded: 1,
    youtubeVideoId: 'InMCIxL2Azk',
    lastUpdated: '2026-10-29',
    isPublished: true,
    steps: [
      {
        stepNumber: 1,
        title: 'Create an Autopilot cluster',
        description: 'Spin up a production-ready GKE Autopilot cluster in us-central1.',
        command: 'gcloud container clusters create-auto my-autopilot-cluster --region us-central1',
      },
      {
        stepNumber: 2,
        title: 'Deploy application workloads',
        description: 'Apply the deployment manifest and expose the service on port 80.',
        command: 'kubectl create deployment hello-server --image=us-docker.pkg.dev/google-samples/containers/gke/hello-app:1.0\nkubectl expose deployment hello-server --type LoadBalancer --port 80 --target-port 8080',
      },
    ],
    importantCommands: [
      'kubectl get services --watch',
      'kubectl scale deployment hello-server --replicas=5',
    ],
  },
];

export const initialUnstopProblems: UnstopProblem[] = [
  {
    id: 'uns-day-9',
    dayNumber: 9,
    date: getDateIsoDaysAgo(0),
    title: 'Find the maximum sum of a subarray with length K',
    slug: 'day-9-maximum-sum-subarray-length-k',
    difficulty: 'Medium',
    description: 'Given an array of integers `nums` and an integer `k`, find the maximum sum of any contiguous subarray of size `k`. If the array contains fewer than `k` elements, return 0.',
    inputFormat: 'First line contains n (array size) and integer k.\nSecond line contains n space-separated integers.',
    outputFormat: 'Single integer representing the maximum subarray sum of length k.',
    constraints: [
      '1 <= k <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
    ],
    examples: [
      {
        input: '6 3\n2 1 5 1 3 2',
        output: '9',
        explanation: 'Subarray [5, 1, 3] gives the maximum sum of 9.',
      },
    ],
    solutionExplanation: 'Use the sliding window technique. Compute the sum of the first k elements. Then slide the window across the array by adding the next element and subtracting the leftmost element of the previous window in O(1) per step.',
    codeSolutions: [
      {
        language: 'c',
        code: `#include <stdio.h>

long long maxSubarraySum(int nums[], int n, int k) {
    if (n < k) return 0;
    long long windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += nums[i];
    long long maxSum = windowSum;
    for (int i = k; i < n; i++) {
        windowSum += nums[i] - nums[i - k];
        if (windowSum > maxSum) maxSum = windowSum;
    }
    return maxSum;
}

int main() {
    int nums[] = {2, 1, 5, 1, 3, 2};
    int k = 3;
    printf("Max Sum: %lld\\n", maxSubarraySum(nums, 6, k));
    return 0;
}`,
      },
      {
        language: 'cpp',
        code: `#include <iostream>
#include <vector>
#include <numeric>
using namespace std;

long long maxSubarraySum(const vector<int>& nums, int k) {
    if (nums.size() < k) return 0;
    long long windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += nums[i];
    long long maxSum = windowSum;
    for (size_t i = k; i < nums.size(); i++) {
        windowSum += nums[i] - nums[i - k];
        maxSum = max(maxSum, windowSum);
    }
    return maxSum;
}

int main() {
    vector<int> nums = {2, 1, 5, 1, 3, 2};
    cout << "Max Sum: " << maxSubarraySum(nums, 3) << endl;
    return 0;
}`,
      },
      {
        language: 'python',
        code: `def max_subarray_sum(nums, k):
    if len(nums) < k:
        return 0
    window_sum = sum(nums[:k])
    max_sum = window_sum
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, window_sum)
    return max_sum

print(max_subarray_sum([2, 1, 5, 1, 3, 2], 3))`,
      },
    ],
    tags: ['Sliding Window', 'Arrays', 'Unstop POTD', 'Medium'],
  },
  {
    id: 'uns-day-8',
    dayNumber: 8,
    date: getDateIsoDaysAgo(1),
    title: 'Check if a number is a palindrome',
    slug: 'day-8-palindrome-number',
    difficulty: 'Easy',
    description: 'Given an integer `x`, return `true` if `x` is a palindrome, and `false` otherwise. An integer is a palindrome when it reads the same forward and backward without converting the integer to a string.',
    inputFormat: 'A single integer x.',
    outputFormat: 'Return true if palindrome, otherwise false.',
    constraints: [
      '-2^31 <= x <= 2^31 - 1',
    ],
    examples: [
      {
        input: '121',
        output: 'true',
        explanation: '121 reads as 121 from left to right and from right to left.',
      },
      {
        input: '-121',
        output: 'false',
        explanation: 'From left to right, it reads -121. From right to left it becomes 121-, so not palindrome.',
      },
    ],
    solutionExplanation: 'Negative numbers and numbers ending with 0 (except 0 itself) cannot be palindromes. Revert the second half of the number by repeatedly taking x % 10, then compare the reverted half with the remaining first half.',
    codeSolutions: [
      {
        language: 'c',
        code: `#include <stdio.h>
#include <stdbool.h>

bool isPalindrome(int x) {
    if (x < 0 || (x % 10 == 0 && x != 0)) return false;
    int reverted = 0;
    while (x > reverted) {
        reverted = reverted * 10 + x % 10;
        x /= 10;
    }
    return x == reverted || x == reverted / 10;
}

int main() {
    printf("%s\\n", isPalindrome(121) ? "true" : "false");
    return 0;
}`,
      },
      {
        language: 'cpp',
        code: `#include <iostream>
using namespace std;

bool isPalindrome(int x) {
    if (x < 0 || (x % 10 == 0 && x != 0)) return false;
    int reverted = 0;
    while (x > reverted) {
        reverted = reverted * 10 + x % 10;
        x /= 10;
    }
    return x == reverted || x == reverted / 10;
}

int main() {
    cout << boolalpha << isPalindrome(121) << endl;
    return 0;
}`,
      },
    ],
    tags: ['Math', 'Bitwise', 'Unstop POTD', 'Easy'],
  },
  {
    id: 'uns-day-7',
    dayNumber: 7,
    date: getDateIsoDaysAgo(2),
    title: 'Count the number of distinct elements in every sliding window of size K',
    slug: 'day-7-distinct-elements-window',
    difficulty: 'Medium',
    description: 'Given an array of integers and a number K, find the count of distinct elements in every contiguous window of size K in the array.',
    inputFormat: 'First line contains integer n and integer k.\nSecond line contains n space-separated integers.',
    outputFormat: 'Space-separated integers denoting count of distinct elements for each window.',
    constraints: [
      '1 <= k <= n <= 10^5',
      '1 <= arr[i] <= 10^5',
    ],
    examples: [
      {
        input: '7 4\n1 2 1 3 4 2 3',
        output: '3 4 4 3',
        explanation: 'Window 1: [1, 2, 1, 3] -> 3 distinct elements (1, 2, 3)\nWindow 2: [2, 1, 3, 4] -> 4 distinct elements (1, 2, 3, 4)\nWindow 3: [1, 3, 4, 2] -> 4 distinct elements (1, 2, 3, 4)\nWindow 4: [3, 4, 2, 3] -> 3 distinct elements (2, 3, 4)',
      },
    ],
    solutionExplanation: 'Use a hash map or frequency array alongside the sliding window. Maintain distinct count: if a new element frequency becomes 1, increment count; when removing an outgoing element, decrement its frequency, and if it becomes 0, decrement count.',
    codeSolutions: [
      {
        language: 'cpp',
        code: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

vector<int> countDistinct(const vector<int>& nums, int k) {
    unordered_map<int, int> freq;
    vector<int> result;
    for (int i = 0; i < k; i++) freq[nums[i]]++;
    result.push_back(freq.size());
    for (size_t i = k; i < nums.size(); i++) {
        if (--freq[nums[i - k]] == 0) freq.erase(nums[i - k]);
        freq[nums[i]]++;
        result.push_back(freq.size());
    }
    return result;
}

int main() {
    vector<int> nums = {1, 2, 1, 3, 4, 2, 3};
    auto res = countDistinct(nums, 4);
    for (int v : res) cout << v << " ";
    cout << endl;
    return 0;
}`,
      },
    ],
    tags: ['Sliding Window', 'Hash Map', 'Unstop POTD', 'Medium'],
  },
  {
    id: 'uns-104',
    dayNumber: 104,
    date: getDateIsoDaysAgo(0),
    title: 'Subarray Sum Equals K with Negative Numbers',
    slug: 'subarray-sum-equals-k',
    difficulty: 'Medium',
    description: 'Given an array of integers `nums` and an integer `k`, return the total number of continuous subarrays whose sum equals to `k`. The array may contain positive, zero, and negative integers.',
    inputFormat: 'First line contains integer n (array size) and integer k.\nSecond line contains n space-separated integers.',
    outputFormat: 'Single integer representing count of qualifying subarrays.',
    constraints: [
      '1 <= nums.length <= 2 * 10^4',
      '-1000 <= nums[i] <= 1000',
      '-10^7 <= k <= 10^7',
    ],
    examples: [
      {
        input: '3 2\n1 1 1',
        output: '2',
        explanation: 'Subarrays [nums[0]..nums[1]] and [nums[1]..nums[2]] both sum to 2.',
      },
      {
        input: '3 3\n1 2 3',
        output: '2',
        explanation: 'Subarrays [1, 2] and [3] both equal k = 3.',
      },
    ],
    solutionExplanation: 'A naive O(n^2) approach checks all subarrays. However, by computing prefix sums and storing their frequency in a hash map, we can check if (current_prefix_sum - k) was observed before in O(1) time. This reduces the total time complexity to O(n) with O(n) space.',
    codeSolutions: [
      {
        language: 'c',
        code: `#include <stdio.h>
#include <stdlib.h>

typedef struct HashNode {
    long long key;
    int count;
    struct HashNode* next;
} HashNode;

#define BUCKETS 10007
HashNode* table[BUCKETS];

int hash(long long key) {
    int h = key % BUCKETS;
    return h < 0 ? h + BUCKETS : h;
}

int getCount(long long key) {
    int h = hash(key);
    HashNode* curr = table[h];
    while (curr) {
        if (curr->key == key) return curr->count;
        curr = curr->next;
    }
    return 0;
}

void increment(long long key) {
    int h = hash(key);
    HashNode* curr = table[h];
    while (curr) {
        if (curr->key == key) {
            curr->count++;
            return;
        }
        curr = curr->next;
    }
    HashNode* newNode = (HashNode*)malloc(sizeof(HashNode));
    newNode->key = key;
    newNode->count = 1;
    newNode->next = table[h];
    table[h] = newNode;
}

int subarraySum(int* nums, int numsSize, int k) {
    for (int i = 0; i < BUCKETS; i++) table[i] = NULL;
    increment(0);
    
    long long prefixSum = 0;
    int totalCount = 0;
    
    for (int i = 0; i < numsSize; i++) {
        prefixSum += nums[i];
        totalCount += getCount(prefixSum - k);
        increment(prefixSum);
    }
    return totalCount;
}

int main() {
    int nums[] = {1, 1, 1};
    int k = 2;
    int res = subarraySum(nums, 3, k);
    printf("Total Subarrays: %d\\n", res);
    return 0;
}`,
      },
      {
        language: 'cpp',
        code: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

int subarraySum(vector<int>& nums, int k) {
    unordered_map<long long, int> prefixCounts;
    prefixCounts[0] = 1;
    
    long long prefixSum = 0;
    int total = 0;
    
    for (int num : nums) {
        prefixSum += num;
        if (prefixCounts.find(prefixSum - k) != prefixCounts.end()) {
            total += prefixCounts[prefixSum - k];
        }
        prefixCounts[prefixSum]++;
    }
    return total;
}

int main() {
    vector<int> nums = {1, 2, 3};
    cout << subarraySum(nums, 3) << endl;
    return 0;
}`,
      },
      {
        language: 'python',
        code: `def subarray_sum(nums, k):
    prefix_counts = {0: 1}
    prefix_sum = 0
    total = 0
    
    for num in nums:
        prefix_sum += num
        if prefix_sum - k in prefix_counts:
            total += prefix_counts[prefix_sum - k]
        prefix_counts[prefix_sum] = prefix_counts.get(prefix_sum, 0) + 1
        
    return total

if __name__ == "__main__":
    print(subarray_sum([1, 1, 1], 2))`,
      },
      {
        language: 'java',
        code: `import java.util.HashMap;
import java.util.Map;

public class Solution {
    public static int subarraySum(int[] nums, int k) {
        Map<Long, Integer> prefixCounts = new HashMap<>();
        prefixCounts.put(0L, 1);
        long sum = 0;
        int count = 0;
        
        for (int num : nums) {
            sum += num;
            if (prefixCounts.containsKey(sum - k)) {
                count += prefixCounts.get(sum - k);
            }
            prefixCounts.put(sum, prefixCounts.getOrDefault(sum, 0) + 1);
        }
        return count;
    }
}`,
      },
      {
        language: 'javascript',
        code: `function subarraySum(nums, k) {
  const map = new Map();
  map.set(0, 1);
  let prefixSum = 0;
  let count = 0;
  
  for (const num of nums) {
    prefixSum += num;
    if (map.has(prefixSum - k)) {
      count += map.get(prefixSum - k);
    }
    map.set(prefixSum, (map.get(prefixSum) || 0) + 1);
  }
  return count;
}

console.log(subarraySum([1, 1, 1], 2));`,
      },
    ],
    youtubeVideoId: '9X0JToHJ2to',
    tags: ['Prefix Sum', 'Hash Map', 'Unstop 30 Days POTD'],
  },
  {
    id: 'uns-103',
    dayNumber: 103,
    date: getDateIsoDaysAgo(1),
    title: 'Valid Palindrome After At Most One Character Deletion',
    slug: 'valid-palindrome-ii',
    difficulty: 'Easy',
    description: 'Given a string `s`, return `true` if the `s` can be palindrome after deleting at most one character from it.',
    inputFormat: 'A single string consisting of lowercase English letters.',
    outputFormat: 'Return true or false.',
    constraints: ['1 <= s.length <= 10^5', 's consists of lowercase English letters.'],
    examples: [
      {
        input: 'abca',
        output: 'true',
        explanation: 'You could delete the character \'c\' or \'b\'.',
      },
    ],
    solutionExplanation: 'Use standard two-pointer approach from both ends. When a mismatch is found, test if skipping either left pointer or right pointer creates a valid palindrome.',
    codeSolutions: [
      {
        language: 'c',
        code: `#include <stdio.h>
#include <string.h>
#include <stdbool.h>

bool isPalindromeRange(const char* s, int l, int r) {
    while (l < r) {
        if (s[l++] != s[r--]) return false;
    }
    return true;
}

bool validPalindrome(const char* s) {
    int l = 0, r = strlen(s) - 1;
    while (l < r) {
        if (s[l] != s[r]) {
            return isPalindromeRange(s, l + 1, r) || isPalindromeRange(s, l, r - 1);
        }
        l++;
        r--;
    }
    return true;
}

int main() {
    printf("%s\\n", validPalindrome("abca") ? "true" : "false");
    return 0;
}`,
      },
      {
        language: 'cpp',
        code: `#include <string>
using namespace std;

bool isPalindrome(const string& s, int l, int r) {
    while (l < r) {
        if (s[l++] != s[r--]) return false;
    }
    return true;
}

bool validPalindrome(string s) {
    int l = 0, r = s.size() - 1;
    while (l < r) {
        if (s[l] != s[r]) {
            return isPalindrome(s, l + 1, r) || isPalindrome(s, l, r - 1);
        }
        l++;
        r--;
    }
    return true;
}`,
      },
    ],
    tags: ['Two Pointers', 'String', 'Greedy', 'Unstop POTD'],
  },
];

export const initialBlogs: BlogPost[] = [
  {
    id: 'blog-gsa-2026',
    slug: 'google-student-ambassador-2026-guide',
    title: 'Google Student Ambassador 2026: Zero to Hero Guide & Registration Link',
    summary: 'Complete step-by-step application blueprint by Saksham Sharma. How to crack the selection rounds, showcase community leadership, and claim guaranteed Google swag kits.',
    category: 'Google Cloud',
    tags: ['Google Student Ambassador', 'Google Cloud', 'Swags', 'Student Opportunity', 'Guide'],
    coverImage: 'https://i.ytimg.com/vi/JVE_m3awBTU/hqdefault.jpg',
    author: {
      name: 'Saksham Sharma',
      role: 'Founder of SakshamXTech',
      avatar: '/assets/branding/saksham_portrait.png',
    },
    publishedAt: '2026-11-03',
    readTimeMinutes: 7,
    featured: true,
    views: 14200,
    youtubeVideoId: 'JVE_m3awBTU',
    officialLink: 'https://developers.google.com/community/gdsc',
    officialLinkLabel: 'Official Google Ambassador Portal ↗',
    deadline: 'November 25, 2026',
    perks: 'Verified Google Certificate, Exclusive Swags Kit, Mentorship',
    eligibility: 'All Enrolled College / University Students',
    content: `
# Google Student Ambassador 2026: Complete Application Guide

Welcome students! If you are watching our latest YouTube breakdown on **@sakshamxtech**, this article provides the direct verified registration links, application checklist, and key tips to get selected.

## Key Program Benefits:
- 🎁 **Official Google Goodies**: Custom swag box, branded t-shirts, sticker packs, and certificate of appointment.
- 🎓 **Direct Mentorship from Google Engineers**: Monthly masterclasses on Cloud Computing, Generative AI, and Android.
- 🚀 **Campus Leadership**: Organize developer hackathons, tech talks, and Google Cloud study jams in your university.

## Step-by-Step Application Roadmap:
1. **Click the Official Link Above**: Head to the Google Developers Community portal.
2. **Complete Profile Setup**: Ensure your GitHub, LinkedIn, and personal portfolio links are up-to-date.
3. **Draft Impactful Answers**: Highlight past community involvement, willingness to learn, and public speaking experience.
4. **Video Submission**: Keep your 60-second intro clear, confident, and focused on why you want to empower your peers.

Join the SakshamXTech Telegram community for live Q&A, mock reviews, and updates!
    `,
  },
  {
    id: 'blog-cloud-guide',
    slug: 'how-to-complete-getting-started-with-cloud',
    title: 'How to Complete Getting Started with Cloud...',
    summary: 'A step-by-step master walkthrough on how to complete the Google Cloud foundational labs, configure Cloud Shell, and earn maximum points in record time.',
    category: 'Google Cloud',
    tags: ['Google Cloud', 'Getting Started', 'Cloud Shell', 'Beginner Guide'],
    coverImage: '/assets/branding/arcade_skill_badges.png',
    author: {
      name: 'Saksham Sharma',
      role: 'Founder of SakshamXTech',
      avatar: '/assets/branding/saksham_portrait.png',
    },
    publishedAt: 'Mar 10, 2026',
    readTimeMinutes: 8,
    featured: true,
    views: 6200,
    youtubeVideoId: 'zN8XsZ4Cg2M',
    officialLink: 'https://go.cloudskillsboost.google/arcade',
    officialLinkLabel: 'Open Google Cloud Skills Boost ↗',
    deadline: 'Season Active',
    perks: 'Arcade Points, Badges, Cloud Swags',
    eligibility: 'Open to All Developers',
    content: `
# Getting Started with Cloud: Complete Walkthrough

Welcome to the comprehensive walkthrough by Saksham Sharma. Learn how to launch your first virtual machine, set up Cloud Storage buckets, and deploy serverless containers on Google Cloud.
    `,
  },
  {
    id: 'blog-c-roadmap',
    slug: 'c-programming-roadmap-for-beginners',
    title: 'C Programming Roadmap for Beginners',
    summary: 'A complete roadmap to learn C programming from scratch. Master pointers, dynamic memory allocation, data structures, and prepare for systems coding interviews.',
    category: 'Programming',
    tags: ['C Programming', 'Beginners', 'Roadmap', 'Pointers', 'Data Structures'],
    coverImage: '/assets/branding/arcade_1.png',
    author: {
      name: 'Saksham Sharma',
      role: 'Founder of SakshamXTech',
      avatar: '/assets/branding/saksham_portrait.png',
    },
    publishedAt: 'Mar 8, 2026',
    readTimeMinutes: 10,
    featured: true,
    views: 4500,
    youtubeVideoId: 'zN8XsZ4Cg2M',
    content: `
# C Programming Roadmap for Beginners

C is the foundational language of computing. In this complete guide, Saksham Sharma outlines the structured 30-day curriculum to go from zero to building your own memory allocator.
    `,
  },
  {
    id: 'blog-1',
    slug: 'google-cloud-arcade-2026-strategy-guide',
    title: 'Google Cloud Arcade 2026: Official Roadmap to Unlock Champion Tier Swags',
    summary: 'A complete step-by-step master plan by Saksham Sharma on how to earn 45+ Arcade points, complete Skill Badges, and secure the Weather-Shield Bomber Jacket and Champion kit.',
    category: 'Google Cloud',
    tags: ['Google Cloud', 'Arcade 2026', 'Swag Unboxing', 'Certifications', 'Free Cloud Credits'],
    coverImage: 'https://i.ytimg.com/vi/InMCIxL2Azk/hqdefault.jpg',
    author: {
      name: 'Saksham Sharma',
      role: 'Founder of SakshamXTech',
      avatar: '/assets/aistudio/file_00000000539c820792579291e97b0d13_1673057a.png',
    },
    publishedAt: '2026-10-30',
    readTimeMinutes: 8,
    featured: true,
    views: 38400,
    youtubeVideoId: 'InMCIxL2Azk',
    content: `
# Mastering Google Cloud Arcade 2026 Season

Google Cloud Arcade is the largest gamified learning experience for cloud engineering students in India and worldwide.

## Key Program Rules for 2026

1. **Skill Badges Count**: Completing a recognized Google Cloud Skill Badge grants **1 Arcade Point**.
2. **Arcade Trivia Quizzes**: Released bi-weekly on the official Arcade portal. Each yields **1 point** with minimal lab time.
3. **Facilitator Cohorts**: Look out for seasonal cohorts that provide free Qwiklabs credits and bonus milestones.

## Recommended Learning Path

- **Week 1-2**: Complete core foundational badges (GSP001 to GSP010) on Compute Engine and Cloud Storage.
- **Week 3-4**: Jump into Serverless & Containerization (Cloud Run, GKE Autopilot).
- **Week 5**: Tackle Generative AI badges using Vertex AI studio and multimodal prompts.

### Pro-Tip for Fast Verification
Always run verification checks inside Qwiklabs after each task. Ensure your environment variables match the lab instruction sheet exactly!
    `,
  },
  {
    id: 'blog-2',
    slug: 'c-programming-memory-management-deep-dive',
    title: 'C Programming Under the Hood: Stack, Heap, Pointers & Memory Leaks',
    summary: 'Understand how the CPU executes C binaries, how pointers map virtual memory, and how Valgrind helps you write leak-free high-performance systems code.',
    category: 'Programming',
    tags: ['C Language', 'Memory Management', 'Pointers', 'Systems Programming', 'C Academy'],
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'Saksham Sharma',
      role: 'Founder of SakshamXTech',
      avatar: '/assets/aistudio/file_00000000539c820792579291e97b0d13_1673057a.png',
    },
    publishedAt: '2026-10-24',
    readTimeMinutes: 9,
    featured: false,
    views: 24900,
    youtubeVideoId: 'ZnL2ZK0-KHg',
    content: `
# C Memory Management Explained Clearly

In modern high-level languages like Python and JavaScript, garbage collectors hide physical memory allocation from you. In C, you are in direct conversation with the operating system kernel.

## 1. The Anatomy of Process Memory
Every C executable is loaded into a virtual memory segment containing:
- **Text / Code Segment**: Read-only machine instructions.
- **Data & BSS**: Global and static variables.
- **Stack**: Fast, LIFO memory for local variables and function call frames.
- **Heap**: Dynamic memory requested at runtime via \`malloc\`, \`calloc\`, \`realloc\`.
    `,
  },
  {
    id: 'blog-3',
    slug: 'how-to-solve-daily-unstop-potd-consistently',
    title: 'How to Maintain a 100-Day Unstop POTD Streak (Secret Patterns & Strategy)',
    summary: 'A tactical approach to analyzing Problem of the Day constraints, recognizing sliding windows, two pointers, and prefix sums in under 5 minutes.',
    category: 'Career',
    tags: ['Unstop', 'POTD', 'DSA Roadmap', 'Competitive Coding'],
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'Saksham Sharma',
      role: 'Founder of SakshamXTech',
      avatar: '/assets/aistudio/file_00000000539c820792579291e97b0d13_1673057a.png',
    },
    publishedAt: '2026-10-20',
    readTimeMinutes: 7,
    featured: true,
    views: 31200,
    youtubeVideoId: '7o04fV3sRrw',
    content: `
# Mastering Daily Unstop Problems of the Day

Competitive coding platforms like Unstop test specific core archetypes every day.

## 3 Cardinal Rules for Speed:
1. **Analyze Constraints First**: $10^5$ constraints instantly tell you that an $O(n^2)$ algorithm will result in Time Limit Exceeded (TLE). You need $O(n)$ or $O(n \\log n)$.
2. **Hash Map Lookups**: Whenever a problem asks for continuous subarrays with a sum or property, prefix sums with hash map frequency lookups are your best friend.
3. **Dual Language Preparation**: Write code in C/C++ for pure execution speed and Python for rapid prototyping.
    `,
  },
];

export const initialOpportunities: Opportunity[] = [
  {
    id: 'opp-gcf-2026',
    title: 'Google Cloud Facilitator Program 2026',
    slug: 'google-cloud-facilitator-program-2026',
    company: 'Google Cloud',
    logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=120&q=80',
    category: 'Student Programs',
    type: 'Remote',
    description: 'Join the Google Cloud Facilitator Program and get mentored by Google Cloud experts, earn exclusive swag packs, and complete certifications.',
    eligibility: 'Open to university and college students across India passionate about Google Cloud.',
    benefits: ['Official Google Cloud certification exam vouchers', 'Exclusive Facilitator hoodie, backpack, and swag kit', 'Direct community leadership recognition'],
    deadline: '2026-11-25',
    officialUrl: 'https://cloud.google.com/edu',
    status: 'Active',
    featured: true,
    postedDate: '2026-11-01',
    clicksCount: 3200,
  },
  {
    id: 'opp-mlsa-2026',
    title: 'Microsoft Learn Student Ambassador',
    slug: 'microsoft-learn-student-ambassador',
    company: 'Microsoft',
    logo: 'https://images.unsplash.com/photo-1642132652806-96b65980b182?auto=format&fit=crop&w=120&q=80',
    category: 'Student Programs',
    type: 'Remote',
    description: 'Become a Microsoft Learn Student Ambassador and get mentorship, exclusive swag, Azure credits, and global exposure.',
    eligibility: 'Enrolled in an accredited university with a drive to learn and lead tech communities.',
    benefits: ['Free Azure Cloud credits ($150/month)', 'Exclusive Microsoft Learn Swag Box', 'Direct networking with Microsoft program managers'],
    deadline: '2026-11-30',
    officialUrl: 'https://studentambassadors.microsoft.com',
    status: 'Active',
    featured: true,
    postedDate: '2026-10-28',
    clicksCount: 2900,
  },
  {
    id: 'opp-1',
    title: 'Google Summer of Code (GSoC) 2027 Mentee Applications',
    slug: 'google-summer-of-code-2027',
    company: 'Google Open Source',
    logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=120&q=80',
    category: 'Student Programs',
    type: 'Remote',
    description: 'An international program bringing student and beginner developers into open-source software development with mentoring organizations worldwide.',
    eligibility: 'Must be 18+ years of age, open to university students and beginner developers globally.',
    benefits: ['Country-adjusted stipend ($1500 - $3000)', 'Direct 1-on-1 mentorship from global OSS maintainers', 'Google Certificate of Completion'],
    deadline: '2026-11-28',
    officialUrl: 'https://summerofcode.withgoogle.com',
    status: 'Active',
    featured: true,
    postedDate: '2026-10-01',
    clicksCount: 1420,
  },
  {
    id: 'opp-2',
    title: 'Microsoft Learn Student Ambassadors (MLSA) 2026 Cohort',
    slug: 'microsoft-learn-student-ambassador-cohort',
    company: 'Microsoft',
    logo: 'https://images.unsplash.com/photo-1642132652806-96b65980b182?auto=format&fit=crop&w=120&q=80',
    category: 'Student Programs',
    type: 'Remote',
    description: 'A global community of student technology leaders who are eager to build community, solve problems, and share knowledge about Azure, AI, and developer tools.',
    eligibility: 'Enrolled in an accredited higher education institution with passion for tech community building.',
    benefits: ['Free Azure Cloud credits ($150/month)', 'Microsoft 365 Enterprise Subscription', 'Exclusive Swag Kits & Alpha/Beta/Gold certificates', 'LinkedIn Learning access'],
    deadline: '2026-11-30',
    officialUrl: 'https://studentambassadors.microsoft.com',
    status: 'Active',
    featured: true,
    postedDate: '2026-10-05',
    clicksCount: 2180,
  },
  {
    id: 'opp-3',
    title: 'Smart India Hackathon (SIH) Hardware & Software Edition',
    slug: 'smart-india-hackathon-2026',
    company: 'Ministry of Education & AICTE',
    logo: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=120&q=80',
    category: 'Hackathons',
    type: 'Hybrid',
    location: 'Nodal Centers across India',
    description: 'World\'s biggest open innovation model bringing college students to solve pressing challenges faced by Indian Ministries and Industry leaders.',
    eligibility: 'Team of 6 students from recognized Indian colleges with at least one female teammate.',
    benefits: ['₹1,00,000 cash prize per problem statement', 'Direct incubation and patenting support', 'Government recognition'],
    deadline: '2026-11-18',
    officialUrl: 'https://www.sih.gov.in',
    status: 'Closing Soon',
    featured: true,
    postedDate: '2026-10-10',
    clicksCount: 3840,
  },
];

export const initialSwags: SwagItem[] = [
  {
    id: 'swag-lumisnap-light',
    title: 'Magnetic Fill Light',
    brand: 'Google Cloud Arcade',
    category: 'Lighting',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    description: 'LumiSnap official magnetic rechargeable fill light with dual-tone brightness and mount clip for content creators.',
    tierRequired: 'Champion, Legend',
    tierTags: ['Champion', 'Legend'],
    revealedDate: '3 November 2026',
    pointsRequired: 95,
    eligibility: 'Champion Tier (95 Pts) or Legend Tier (120 Pts) achievers',
    howToClaim: [
      'Reach Champion or Legend Tier points on Cloud Skills Boost.',
      'Check official Prize Counter claim voucher.',
      'Order with free international delivery.',
    ],
    campaignStartDate: '2026-08-01',
    campaignEndDate: '2026-12-31',
    officialSourceUrl: 'https://go.qwiklabs.com/arcade',
    status: 'Active',
    featured: true,
  },
  {
    id: 'swag-magic-mug',
    title: 'Magic Mug',
    brand: 'Google Cloud Arcade',
    category: 'Magic Mug',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    description: 'Color-changing heat-sensitive ceramic mug revealing official Google Cloud Arcade 2026 constellations when filled with warm coffee or tea.',
    tierRequired: 'Trooper, Ranger',
    tierTags: ['Trooper', 'Ranger'],
    revealedDate: '23 October 2026',
    pointsRequired: 50,
    eligibility: 'Trooper Tier (50 Pts) or Ranger Tier (75 Pts) achievers',
    howToClaim: [
      'Reach Trooper or Ranger Tier points on Cloud Skills Boost.',
      'Select Magic Mug during redemption window.',
      'Enter delivery address.',
    ],
    campaignStartDate: '2026-08-01',
    campaignEndDate: '2026-12-31',
    officialSourceUrl: 'https://go.qwiklabs.com/arcade',
    status: 'Active',
    featured: true,
  },
  {
    id: 'swag-travel-bottle',
    title: 'Travel Bottle',
    brand: 'Google Cloud Arcade',
    category: 'Water Bottle',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
    description: 'Double-wall vacuum insulated stainless steel white travel bottle featuring top loop handle and official Google Cloud color logo.',
    tierRequired: 'Trooper, Ranger',
    tierTags: ['Trooper', 'Ranger'],
    revealedDate: '16 October 2026',
    pointsRequired: 50,
    eligibility: 'Trooper Tier (50 Pts) or Ranger Tier (75 Pts) achievers',
    howToClaim: [
      'Complete designated Skill Badges on Cloud Skills Boost.',
      'Select Travel Bottle at Prize Counter.',
      'Confirm residential address.',
    ],
    campaignStartDate: '2026-08-01',
    campaignEndDate: '2026-12-31',
    officialSourceUrl: 'https://go.qwiklabs.com/arcade',
    status: 'Active',
    featured: true,
  },
  {
    id: 'swag-popup-pro',
    title: 'PopUp Pro',
    brand: 'Google Cloud Arcade',
    category: 'Tech Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    description: 'Multi-functional compact portable cable kit with USB-C, Lightning, Micro-USB adapters, and phone stand kickstand.',
    tierRequired: 'Champion, Legend',
    tierTags: ['Champion', 'Legend'],
    revealedDate: '12 October 2026',
    pointsRequired: 95,
    eligibility: 'Champion Tier (95 Pts) or Legend Tier (120 Pts) achievers',
    howToClaim: [
      'Reach 95+ points for Champion or 120+ points for Legend.',
      'Claim PopUp Pro accessory kit.',
    ],
    campaignStartDate: '2026-08-01',
    campaignEndDate: '2026-12-31',
    officialSourceUrl: 'https://go.qwiklabs.com/arcade',
    status: 'Active',
    featured: true,
  },
  {
    id: 'swag-backpack',
    title: 'Backpack',
    brand: 'Google Cloud Arcade',
    category: 'Backpack',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    description: 'Dual-tone navy & slate water-resistant ergonomic tech backpack with padded laptop sleeve and embroidered Google Cloud branding.',
    tierRequired: 'Ranger',
    tierTags: ['Ranger'],
    revealedDate: '24 September 2026',
    pointsRequired: 75,
    eligibility: 'Ranger Tier (75 Pts) achievers',
    howToClaim: [
      'Earn 75+ Arcade points during the active 2026 season.',
      'Select Backpack from Ranger Tier during Prize Counter opening.',
    ],
    campaignStartDate: '2026-08-01',
    campaignEndDate: '2026-12-31',
    officialSourceUrl: 'https://go.qwiklabs.com/arcade',
    status: 'Active',
    featured: true,
  },
  {
    id: 'swag-weather-jacket',
    title: 'Weather-Shield Jacket',
    brand: 'Google Cloud Arcade',
    category: 'Jacket',
    imageUrl: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=600&q=80',
    description: 'High-performance wind & water resistant weather-shield jacket with Google Cloud Arcade emblem and storm-proof zips.',
    tierRequired: 'Champion, Legend',
    tierTags: ['Champion', 'Legend'],
    revealedDate: '15 September 2026',
    pointsRequired: 95,
    eligibility: 'Champion Tier (95 Pts) or Legend Tier (120 Pts) achievers',
    howToClaim: [
      'Accumulate 95+ points on Cloud Skills Boost.',
      'Choose preferred size at official Prize Counter.',
      'Receive dispatch tracking ID.',
    ],
    campaignStartDate: '2026-08-01',
    campaignEndDate: '2026-12-31',
    officialSourceUrl: 'https://go.qwiklabs.com/arcade',
    status: 'Active',
    featured: true,
  },
  {
    id: 'swag-microsoft-kit',
    title: 'Microsoft Learn Swag Kit',
    brand: 'Microsoft',
    category: 'Combo Swag',
    imageUrl: '/assets/branding/swag_bottle.png',
    description: 'T-Shirt, Stickers, and more. Free official welcome swag pack for accepted Microsoft Learn Student Ambassadors.',
    tierRequired: 'Microsoft Learn Students',
    tierTags: ['All Tiers'],
    revealedDate: 'Ongoing 2026',
    pointsRequired: 0,
    eligibility: 'Microsoft Learn Students',
    howToClaim: [
      'Apply and get selected into the Microsoft Learn Student Ambassador program.',
      'Complete onboarding milestone to unlock your welcome swag code.',
      'Redeem swag on the official Microsoft Company Store.',
    ],
    campaignStartDate: '2026-01-01',
    campaignEndDate: 'Ongoing',
    officialSourceUrl: 'https://studentambassadors.microsoft.com',
    status: 'Active',
    featured: true,
  },
];

export const initialCLessons: CLesson[] = [
  {
    id: 'c-1',
    dayNumber: 1,
    title: 'Introduction to C & GCC Compilation Pipeline',
    slug: 'day-1-introduction-to-c',
    summary: 'Discover why C powers modern kernels and operating systems. Understand the 4 phases: Preprocessing, Compiling, Assembly, and Linking.',
    durationMinutes: 32,
    youtubeVideoId: 'ZnL2ZK0-KHg',
    content: `
# Day 1: Welcome to the C Programming Academy!

Hosted by Saksham Sharma on the SakshamXTech YouTube channel. C is the foundation of high-performance operating systems, browsers (V8 engine), and databases.

## The 4 Steps of Compilation
When you run \`gcc main.c -o main\`, 4 distinct phases occur:
1. **Preprocessor (\`cpp\`)**: Strips comments, handles \`#include\` directives and macros.
2. **Compiler (\`gcc\`)**: Translates preprocessed C code into Architecture-specific Assembly.
3. **Assembler (\`as\`)**: Converts Assembly into machine object code (\`.o\` binary).
4. **Linker (\`ld\`)**: Merges object code with standard C library functions (like \`printf\` in \`libc.so\`) to produce the final executable!
    `,
    codeSnippet: `#include <stdio.h>

int main() {
    printf("Hello SakshamXTech!\\n");
    printf("Welcome to Day 1 of C Academy with Saksham Sharma.\\n");
    return 0;
}`,
    expectedOutput: `Hello SakshamXTech!\nWelcome to Day 1 of C Academy with Saksham Sharma.`,
    practiceQuestions: [
      {
        question: 'Modify the code to print your name, college, and your target score for Google Cloud Arcade 2026.',
        solutionCode: `#include <stdio.h>

int main() {
    printf("Name: Student\\n");
    printf("Goal: Champion Tier 45 Points\\n");
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: 'Which stage of the GCC compilation pipeline handles #include directives?',
        options: ['Compiler', 'Preprocessor', 'Linker', 'Assembler'],
        correctIndex: 1,
        explanation: 'The Preprocessor handles all directives beginning with # before compilation begins.',
      },
    ],
    isPublished: true,
  },
  {
    id: 'c-2',
    dayNumber: 2,
    title: 'Variables, RAM Allocation & Address-of Operator (&)',
    slug: 'day-2-variables-and-memory',
    summary: 'Understand how variables reserve bytes in physical RAM, how the CPU reads them, and how to inspect hexadecimal addresses using & and %p.',
    durationMinutes: 30,
    youtubeVideoId: 'ZnL2ZK0-KHg',
    content: `
# Day 2: Variables & Memory Layout

A variable is a human-readable identifier pointing to a specific address in computer RAM.

## The Address-of Operator (\`&\`)
In C, you can inspect the exact memory address where your variable lives using the \`&\` operator and \`%p\` format specifier.
    `,
    codeSnippet: `#include <stdio.h>

int main() {
    int age = 21;
    printf("Value of age: %d\\n", age);
    printf("Address of age: %p\\n", (void*)&age);
    printf("Size of age: %lu bytes\\n", sizeof(age));
    return 0;
}`,
    expectedOutput: `Value of age: 21\nAddress of age: 0x7ffd9b...\nSize of age: 4 bytes`,
    practiceQuestions: [],
    quiz: [],
    isPublished: true,
  },
  {
    id: 'c-3',
    dayNumber: 3,
    title: 'Data Types, Format Specifiers & Bit Limits',
    slug: 'day-3-data-types',
    summary: 'Signed vs unsigned numbers, overflow behavior, float representations, and ASCII character encoding.',
    durationMinutes: 28,
    youtubeVideoId: 'ZnL2ZK0-KHg',
    content: 'Deep-dive into IEEE 754 floating point and byte boundaries.',
    codeSnippet: `#include <stdio.h>

int main() {
    char letter = 'S';
    printf("Char: %c, ASCII: %d\\n", letter, (int)letter);
    return 0;
}`,
    expectedOutput: `Char: S, ASCII: 83`,
    practiceQuestions: [],
    quiz: [],
    isPublished: true,
  },
];

export const initialResources: ResourceItem[] = [
  {
    id: 'res-1',
    title: 'Complete C Programming Master Cheat Sheet (PDF)',
    description: 'A 6-page comprehensive reference guide covering syntax, pointers, memory allocation, standard libc functions, and GCC flags by SakshamXTech.',
    category: 'Cheat Sheet',
    format: 'PDF',
    fileSize: '2.4 MB',
    downloadUrl: '#download-c-cheatsheet',
    previewImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    tags: ['C Language', 'Cheat Sheet', 'Quick Reference', 'Interview Prep'],
    downloadsCount: 5840,
    publishedDate: '2026-10-15',
  },
  {
    id: 'res-2',
    title: 'Google Cloud Arcade 2026 Lab Codes & Quick Notes',
    description: 'Consolidated lab codes, speed commands, and prerequisite checklists for the entire Arcade season.',
    category: 'Lab Guide',
    format: 'PDF',
    fileSize: '3.8 MB',
    downloadUrl: '#download-arcade-notes',
    previewImageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    tags: ['Google Cloud', 'Arcade', 'Qwiklabs', 'Cloud Architecture'],
    downloadsCount: 8920,
    publishedDate: '2026-10-22',
  },
  {
    id: 'res-3',
    title: 'Data Structures & Algorithms 75 Pattern Roadmap',
    description: 'Visual pattern roadmap for cracking product-based company coding interviews, categorized by sliding window, two pointers, graphs, and DP.',
    category: 'Roadmap',
    format: 'PDF',
    fileSize: '5.1 MB',
    downloadUrl: '#download-dsa-roadmap',
    previewImageUrl: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=600&q=80',
    tags: ['DSA', 'LeetCode', 'Unstop', 'Interviews'],
    downloadsCount: 9410,
    publishedDate: '2026-10-10',
  },
];

export const initialLeaderboard: LeaderboardUser[] = [
  { rank: 1, displayName: 'Aarav Sharma', points: 48, badgesCount: 42, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80', tier: 'Champion', streakDays: 24 },
  { rank: 2, displayName: 'Sneha Patel', points: 44, badgesCount: 38, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80', tier: 'Champion', streakDays: 19 },
  { rank: 3, displayName: 'Rohan Verma', points: 39, badgesCount: 35, avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80', tier: 'Premium', streakDays: 15 },
  { rank: 4, displayName: 'Pooja Nair', points: 34, badgesCount: 30, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80', tier: 'Premium', streakDays: 12 },
  { rank: 5, displayName: 'Vikram Joshi', points: 28, badgesCount: 25, avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=120&q=80', tier: 'Advanced', streakDays: 8 },
];

export const initialAnalytics: AnalyticsMetric = {
  totalVisitors: 42850,
  todayVisitors: 1940,
  pageViews: 98400,
  resourceDownloads: 8420,
  compilerExecutions: 4290,
  calculatorUses: 7810,
  youtubeClicks: 12180,
  opportunityClicks: 3450,
  topPages: [
    { path: '/', count: 34200 },
    { path: '/google-arcade', count: 28900 },
    { path: '/unstop', count: 18400 },
    { path: '/c-academy', count: 14200 },
    { path: '/c-playground', count: 9800 },
    { path: '/swags', count: 8200 },
  ],
  searchQueries: [
    { query: 'gsp007 load balancer solution', count: 1840 },
    { query: 'arcade swags 2026 prize counter', count: 1520 },
    { query: 'unstop potd today solution', count: 1210 },
    { query: 'c programming pointer cheatsheet', count: 980 },
    { query: 'google summer of code 2027', count: 810 },
  ],
  deviceBreakdown: [
    { device: 'Mobile', percentage: 71 },
    { device: 'Desktop', percentage: 24 },
    { device: 'Tablet', percentage: 5 },
  ],
};
