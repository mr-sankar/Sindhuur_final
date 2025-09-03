import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as Slider from "@radix-ui/react-slider";
import { Switch } from "@/components/ui/switch";
import {
  Grid,
  List,
  Search as SearchIcon,
  Heart,
  X,
  User,
  MapPin,
  Briefcase,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

interface Community {
  _id: string;
  name: string;
  religion: string;
}

interface Religion {
  _id: string;
  name: string;
}

const stateCities = {
  andhra_pradesh: [
    "Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool",
    "Rajahmundry", "Tirupati", "Kadapa", "Anantapur", "Chittoor", "Ongole"
  ],
  arunachal_pradesh: [
    "Itanagar", "Naharlagun", "Pasighat", "Tawang", "Ziro"
  ],
  assam: [
    "Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Tezpur"
  ],
  bihar: [
    "Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga", "Purnia"
  ],
  chhattisgarh: [
    "Raipur", "Bhilai", "Bilaspur", "Korba", "Durg"
  ],
  goa: [
    "Panaji", "Margao", "Vasco da Gama", "Mapusa"
  ],
  gujarat: [
    "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar",
    "Jamnagar", "Junagadh", "Gandhinagar"
  ],
  haryana: [
    "Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal", "Hisar",
    "Rohtak", "Sonipat"
  ],
  himachal_pradesh: [
    "Shimla", "Manali", "Dharamshala", "Mandi", "Kullu", "Solan"
  ],
  jharkhand: [
    "Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh"
  ],
  karnataka: [
    "Bengaluru", "Mysuru", "Mangaluru", "Hubli", "Belagavi", "Davangere",
    "Tumakuru", "Shivamogga", "Ballari", "Udupi", "Hassan", "Raichur",
    "Bidar", "Chitradurga", "Gadag"
  ],
  kerala: [
    "Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Alappuzha",
    "Palakkad", "Kannur", "Malappuram", "Kollam", "Kottayam"
  ],
  madhya_pradesh: [
    "Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", "Sagar", "Satna"
  ],
  maharashtra: [
    "Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur",
    "Amravati", "Kolhapur", "Sangli", "Latur", "Jalgaon", "Akola",
    "Ahmednagar", "Satara", "Chandrapur"
  ],
  manipur: [
    "Imphal", "Thoubal", "Churachandpur", "Ukhrul"
  ],
  meghalaya: [
    "Shillong", "Tura", "Jowai"
  ],
  mizoram: [
    "Aizawl", "Lunglei", "Champhai"
  ],
  nagaland: [
    "Kohima", "Dimapur", "Mokokchung"
  ],
  odisha: [
    "Bhubaneswar", "Cuttack", "Rourkela", "Sambalpur", "Berhampur"
  ],
  punjab: [
    "Amritsar", "Ludhiana", "Jalandhar", "Patiala", "Bathinda", "Mohali"
  ],
  rajasthan: [
    "Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Alwar"
  ],
  sikkim: [
    "Gangtok", "Namchi", "Mangan", "Geyzing"
  ],
  tamil_nadu: [
    "Chennai", "Coimbatore", "Madurai", "Trichy", "Salem", "Erode",
    "Vellore", "Tirunelveli", "Thoothukudi", "Kanchipuram", "Thanjavur",
    "Dindigul", "Karur", "Cuddalore", "Nagapattinam"
  ],
  telangana: [
    "Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam",
    "Mahbubnagar", "Adilabad", "Ramagundam", "Siddipet", "Mancherial"
  ],
  tripura: [
    "Agartala", "Udaipur", "Dharmanagar"
  ],
  uttar_pradesh: [
    "Lucknow", "Kanpur", "Varanasi", "Agra", "Prayagraj", "Meerut",
    "Ghaziabad", "Noida", "Bareilly", "Moradabad", "Aligarh", "Jhansi"
  ],
  uttarakhand: [
    "Dehradun", "Haridwar", "Rishikesh", "Haldwani", "Roorkee", "Nainital"
  ],
  west_bengal: [
    "Kolkata", "Siliguri", "Asansol", "Durgapur", "Howrah", "Darjeeling"
  ],
  andaman_nicobar: ["Port Blair"],
  chandigarh: ["Chandigarh"],
  dadra_nagar_haveli_daman_diu: ["Silvassa", "Daman", "Diu"],
  delhi: ["New Delhi", "Dwarka", "Rohini", "Saket", "Karol Bagh"],
  jammu_kashmir: ["Srinagar", "Jammu", "Anantnag", "Baramulla"],
  ladakh: ["Leh", "Kargil"],
  lakshadweep: ["Kavaratti"],
  puducherry: ["Puducherry", "Karaikal", "Mahe", "Yanam"],
  other: []
};

const Search = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [ageRange, setAgeRange] = useState([25, 35]);
  const [showResults, setShowResults] = useState(true);
  const [passedProfiles, setPassedProfiles] = useState<string[]>([]);
  const [interestedProfiles, setInterestedProfiles] = useState<string[]>([]);
  const [profiles, setProfiles] = useState([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<string>("free");
  const [userProfileId, setUserProfileId] = useState<string>("anonymous");
  const [userGender, setUserGender] = useState<string>("");
  const [interestsSentToday, setInterestsSentToday] = useState<number>(0);
  const [interestLimitReached, setInterestLimitReached] = useState<boolean>(false);
  const [userType, setUserType] = useState<"free" | "premium" | "premium_plus">("free");
  const [selectedReligion, setSelectedReligion] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedEducation, setSelectedEducation] = useState("");
  const [selectedProfession, setSelectedProfession] = useState("");
  const [selectedIncome, setSelectedIncome] = useState("");
  const [horoscopeMatch, setHoroscopeMatch] = useState(false);
  const [photoAvailable, setPhotoAvailable] = useState(false);
  const [popularFilter, setPopularFilter] = useState(false);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [religions, setReligions] = useState<Religion[]>([]);
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch communities and religions
        const [communitiesRes, religionsRes] = await Promise.all([
          fetch(`${BASE_URL}/api/communities`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }),
          fetch(`${BASE_URL}/api/religions`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }),
        ]);

        if (!communitiesRes.ok) {
          const errorData = await communitiesRes.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to fetch communities");
        }
        if (!religionsRes.ok) {
          const errorData = await religionsRes.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to fetch religions");
        }

        const communitiesData = await communitiesRes.json();
        const religionsData = await religionsRes.json();

        console.log("Fetched communities:", communitiesData);
        console.log("Fetched religions:", religionsData);

        setCommunities(communitiesData);
        setReligions(religionsData);
      } catch (error) {
        console.error("Error fetching initial data:", error.message);
        toast({
          title: "Error",
          description: "Failed to load communities or religions. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchInitialData();
  }, [toast]);

  useEffect(() => {
    // Reset selected community when religion changes
    setSelectedCommunity("");
    if (selectedReligion && selectedReligion !== "all") {
      const filtered = communities.filter(community =>
        community.religion?.toLowerCase() === selectedReligion.toLowerCase()
      );
      setFilteredCommunities(filtered);
    } else {
      setFilteredCommunities(communities); // Show all communities when no religion or "all" is selected
    }
  }, [selectedReligion, communities]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile to get subscription status and gender
        const userProfile = localStorage.getItem("loggedInUser");
        const userData = userProfile ? JSON.parse(userProfile) : null;
        const profileId = userData?.profileId || "anonymous";

        const userProfileResponse = await fetch(
          `${BASE_URL}/api/user-profile?profileId=${profileId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        // console.log("All profiles",userProfileResponse)

        if (!userProfileResponse.ok) {
          const errorData = await userProfileResponse.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to fetch user profile");
        }

        const userProfileData = await userProfileResponse.json();
        const subscriptionStatus = userProfileData.user.subscription?.current || "free";
        setCurrentSubscription(subscriptionStatus);
        setUserProfileId(userProfileData.user.profileId || "anonymous");
        setUserGender(userProfileData.user.gender || "");

        if (subscriptionStatus === "free") {
          setUserType("free");
        } else if (subscriptionStatus === "premium") {
          setUserType("premium");
        } else if (subscriptionStatus === "premium plus") {
          setUserType("premium_plus");
        }

        // Fetch interested profiles
        const interestsResponse = await fetch(
          `${BASE_URL}/api/interested-profiles?userProfileId=${userProfileData.user.profileId || "anonymous"}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!interestsResponse.ok) {
          const errorData = await interestsResponse.json().catch(() => ({}));
          throw new Error(`Failed to fetch interested profiles: ${errorData.error || interestsResponse.statusText}`);
        }
        const interestsData = await interestsResponse.json();
        setInterestedProfiles(interestsData.map((profile) => profile.id.toString()));

        // Fetch passed profiles
        const passedResponse = await fetch(
          `${BASE_URL}/api/passed-profiles?userProfileId=${userProfileData.user.profileId || "anonymous"}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!passedResponse.ok) {
          const errorData = await passedResponse.json().catch(() => ({}));
          throw new Error(`Failed to fetch passed profiles: ${errorData.error || passedResponse.statusText}`);
        }
        const passedData = await passedResponse.json();
        setPassedProfiles(passedData.map((profile) => profile.id.toString()));

        // Fetch all profiles
        const profilesResponse = await fetch(`${BASE_URL}/api/profiles`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!profilesResponse.ok) {
          throw new Error(`Failed to fetch profiles: ${profilesResponse.statusText}`);
        }
        const profilesData = await profilesResponse.json();
        console.log("Fetched profiles:", profilesData);
        setProfiles(profilesData);
        setFetchError(null);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setFetchError("Failed to load profiles. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load profiles or interests.",
          variant: "destructive",
        });
      }
    };
    fetchData();
  }, [toast]);

  const sendInterest = async (profileId: string) => {
    // Check if free user has exceeded 2 interests per day
    if (userType === "free" && interestsSentToday >= 2) {
      toast({
        title: "Limit Reached",
        description: "You can only send 2 interests per day as a free user.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log(
        `Sending interest: userProfileId=${userProfileId}, interestedProfileId=${profileId}`
      );
      const response = await fetch(`${BASE_URL}/api/send-interest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userProfileId, interestedProfileId: profileId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to send interest");
      }

      const responseData = await response.json();
      console.log(
        `Interest sent successfully: ${JSON.stringify(responseData, null, 2)}`
      );
      toast({
        title: "Interest Sent",
        description: "Your interest has been sent.",
        variant: "default",
      });
      setInterestedProfiles((prev) => [...prev, profileId]);

      // Increment interests sent today if user is free
      if (userType === "free") {
        setInterestsSentToday((prev) => prev + 1);
      }

      // Call the notification backend route AFTER interest is sent
      const noti = await fetch(
        `${BASE_URL}/api/admin/notifications/${profileId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fromProfileId: userProfileId,
            type: "interest",
            message: "showed interest in you",
          }),
        }
      );
    } catch (error) {
      console.error("Error sending interest:", error.message);
      toast({
        title: "Error",
        description:
          error.message === "Interest already sent for this profile"
            ? "You have already sent interest to this profile."
            : error.message === "Interested profile not found"
              ? "The selected profile does not exist."
              : "Failed to send interest.",
        variant: "destructive",
      });
    }
  };

  const handlePass = async (id: string) => {
    try {
      console.log(
        `Sending pass: userProfileId=${userProfileId}, passedProfileId=${id}`
      );
      const response = await fetch(`${BASE_URL}/api/pass-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userProfileId, passedProfileId: id }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to pass profile");
      }

      setPassedProfiles((prev) => [...prev, id.toString()]);
      toast({
        title: "Profile Passed",
        description: "You have passed on this profile.",
      });
    } catch (error) {
      console.error("Error passing profile:", error.message);
      toast({
        title: "Error",
        description:
          error.message === "Profile not found"
            ? "The selected profile does not exist."
            : "Failed to pass profile.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = () => {
    setShowResults(true);
    console.log("Search triggered with filters:", {
      ageRange,
      selectedCommunity,
      selectedState,
      selectedCity,
      selectedEducation,
      selectedProfession,
      selectedIncome,
      horoscopeMatch,
      photoAvailable,
      popularFilter,
      selectedReligion,
    });
  };

  const handleProfileView = async (profileId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/increment-profile-views`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profileId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to increment profile views");
      }
    } catch (error) {
      console.error("Error incrementing profile views:", error.message);
    }
  };

  const getSubscriptionValue = (sub: string) => {
    const subscription = sub || "free";
    if (subscription === "premium plus") return 3;
    if (subscription === "premium") return 2;
    return 1;
  };

  const getFilteredProfiles = () => {
    const userProfile = localStorage.getItem("loggedInUser");
    const userProfileId = userProfile ? JSON.parse(userProfile).profileId : "anonymous";
    const user = userProfile ? JSON.parse(userProfile) : { lookingFor: "female" };
    const currentSubscription = user.subscription?.current || user.subscription || "free";
    const userLookingFor = user.lookingFor?.toLowerCase() || "female";

    console.log(
      `Filtering profiles. User subscription: ${currentSubscription}, lookingFor: ${userLookingFor}, total profiles: ${profiles.length}, popularFilter: ${popularFilter}, selectedReligion: ${selectedReligion}`
    );

    let filtered = profiles.filter((profile) => {
      console.log(`Evaluating profile ID: ${profile.id}, religion: ${profile.religion}, gender: ${profile.gender}, subscription: ${profile.subscription}`);

      // Exclude the logged-in user's profile
      if (profile.id?.toString() === userProfileId) {
        console.log(`Excluding profile ${profile.id} (own profile)`);
        return false;
      }

      // Subscription visibility filter
      const profileSub = profile.subscription || "free";
      if (currentSubscription === "free" && profileSub !== "free") {
        console.log(`Excluding profile ${profile.id} due to subscription mismatch: ${profileSub}`);
        return false;
      }
      if (currentSubscription === "premium" && profileSub === "premium plus") {
        console.log(`Excluding profile ${profile.id} due to subscription mismatch: ${profileSub}`);
        return false;
      }

      // Horoscope filter for premium plus users
      if (horoscopeMatch && currentSubscription === "premium plus") {
        if (profileSub !== "premium plus") {
          console.log(`Excluding profile ${profile.id} due to non-premium plus subscription: ${profileSub}`);
          return false;
        }
      }

      // Gender filter
      if (profile.gender) {
        if (profile.gender.toLowerCase() !== userLookingFor) {
          console.log(`Excluding profile ${profile.id} due to gender mismatch: ${profile.gender} (looking for: ${userLookingFor})`);
          return false;
        }
      } else {
        console.warn(`Profile ${profile.id} has undefined gender, excluding`);
        return false;
      }

      // Religion filter
      // Religion filter
      if (selectedReligion && selectedReligion !== "all") {
        const profileReligion = profile.religion ? profile.religion.trim().toLowerCase() : "";
        const filterReligion = selectedReligion.trim().toLowerCase();
        if (!profileReligion || profileReligion !== filterReligion) {
          console.log(`Excluding profile ${profile.id} due to religion mismatch: ${profileReligion || "undefined"} (filter: ${filterReligion})`);
          return false;
        }
        console.log(`Profile ${profile.id} matches religion: ${profileReligion}`);
      }

      // Age range filter
      if (profile.age && (profile.age < ageRange[0] || profile.age > ageRange[1])) {
        console.log(`Excluding profile ${profile.id} due to age: ${profile.age} (range: ${ageRange[0]}-${ageRange[1]})`);
        return false;
      }

      // Community filter
      if (selectedCommunity && selectedCommunity !== "all") {
        if (!profile.community || profile.community.toLowerCase() !== selectedCommunity.toLowerCase()) {
          console.log(`Excluding profile ${profile.id} due to community mismatch: ${profile.community || "undefined"}`);
          return false;
        }
      }

      // Location filter (state and city)
      if (selectedState && selectedState !== "all") {
        const profileLocLower = profile.location ? profile.location.toLowerCase() : "";
        if (selectedCity && selectedCity !== "all") {
          if (!profileLocLower.includes(selectedCity.toLowerCase())) {
            console.log(`Excluding profile ${profile.id} due to city mismatch: ${profile.location || "undefined"}`);
            return false;
          }
        } else {
          // If only state is selected, check if profile location contains any city from that state
          const stateCitiesList = stateCities[selectedState] || [];
          if (!stateCitiesList.some(city => profileLocLower.includes(city.toLowerCase()))) {
            console.log(`Excluding profile ${profile.id} due to state mismatch: ${profile.location || "undefined"}`);
            return false;
          }
        }
      }

      // Education filter
      const educationMap = {
        "high-school": ["High School", "12th"],
        diploma: ["Diploma"],
        bachelor: ["B.E", "B.Sc", "B.Des", "B.Pharm", "Bachelor"],
        master: ["MBA", "M.E", "M.Sc", "Master"],
        phd: ["Ph.D", "MD"],
        professional: ["B.E", "MBA", "B.Pharm"],
        other: ["Other"],
      };
      if (selectedEducation && selectedEducation !== "all") {
        const keywords = educationMap[selectedEducation] || [];
        if (!profile.education || !keywords.some((k) => profile.education.toLowerCase().includes(k.toLowerCase()))) {
          console.log(`Excluding profile ${profile.id} due to education: ${profile.education || "undefined"}`);
          return false;
        }
      }

      // Profession filter
      const professionMap = {
        "software-engineer": ["Developer", "Engineer"],
        doctor: ["Doctor", "Nurse"],
        teacher: ["Teacher", "Professor"],
        business: ["Manager", "Business"],
        government: ["Government", "Officer"],
        banking: ["Bank", "Finance"],
        other: ["Other"],
      };
      if (selectedProfession && selectedProfession !== "all") {
        const keywords = professionMap[selectedProfession] || [];
        if (!profile.profession || !keywords.some((k) => profile.profession.toLowerCase().includes(k.toLowerCase()))) {
          console.log(`Excluding profile ${profile.id} due to profession: ${profile.profession || "undefined"}`);
          return false;
        }
      }

      // Income filter
      if (selectedIncome && selectedIncome !== "all") {
        if (!profile.income || profile.income !== selectedIncome) {
          console.log(`Excluding profile ${profile.id} due to income: ${profile.income || "undefined"}`);
          return false;
        }
      }

      // Photo availability filter
      if (photoAvailable) {
        if (!profile.photos || profile.photos <= 0 || !profile.image) {
          console.log(`Excluding profile ${profile.id} due to missing photos: ${profile.photos || 0} and no image`);
          return false;
        }
      }

      console.log(`Including profile ${profile.id}`);
      return true;
    });

    // Apply sorting based on popular filter or subscription
    if (popularFilter) {
      filtered = filtered.sort((a, b) => {
        const aPopularity = (a.viewCount || 0) + (a.interestsReceived || 0);
        const bPopularity = (b.viewCount || 0) + (b.interestsReceived || 0);
        return bPopularity - aPopularity; // Sort descending by popularity
      });
      console.log(
        "Sorted profiles by popularity:",
        JSON.stringify(
          filtered.map((p) => ({ id: p.id, viewCount: p.viewCount || 0, interestsReceived: p.interestsReceived || 0 })),
          null,
          2
        )
      );
    } else if (currentSubscription === "premium plus") {
      filtered = filtered.sort(
        (a, b) =>
          getSubscriptionValue(b.subscription) - getSubscriptionValue(a.subscription)
      );
      console.log(
        "Sorted profiles for premium plus user:",
        JSON.stringify(
          filtered.map((p) => ({ id: p.id, subscription: p.subscription })),
          null,
          2
        )
      );
    }

    // Limit profiles for free users to 5
    if (userType === "free") {
      filtered = filtered.slice(0, 5);
    }

    console.log(`Filtered profiles count: ${filtered.length}`);
    return filtered;
  };

  const filteredProfiles = showResults ? getFilteredProfiles() : [];
  const displayProfiles = filteredProfiles.filter(
    (p) => !passedProfiles.includes(p.id?.toString())
  );
  console.log(
    `Display profiles count: ${displayProfiles.length}, after excluding passed profiles: ${passedProfiles}`
  );

  const isPremiumOrPlus =
    currentSubscription === "premium" || currentSubscription === "premium plus";

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Advanced Search</h1>
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card className="border-yellow-200 sticky top-4">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Search Filters</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block mb-3">
                      Age Range: {ageRange[0]} - {ageRange[1]} years
                    </label>
                    <Slider.Root
                      value={ageRange}
                      onValueChange={setAgeRange}
                      min={18}
                      max={80}
                      step={1}
                      className="relative flex items-center select-none touch-none w-[175px] h-[20px]"
                    >
                      <Slider.Track className="bg-gray-200 relative flex-grow h-[4px] rounded-full">
                        <Slider.Range className="absolute bg-blue-500 h-full rounded-full" />
                      </Slider.Track>
                      <Slider.Thumb className="block w-[15px] h-[15px] bg-blue-500 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300" />
                      <Slider.Thumb className="block w-[15px] h-[15px] bg-blue-500 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300" />
                    </Slider.Root>
                  </div>
                  <div>
                    <Label className="mb-2 block">State
                      {currentSubscription === "free" && (
                        <span className="text-gray-400 text-xs"> (Premium)</span>
                      )}
                    </Label>
                    <Select
                      value={selectedState}
                      onValueChange={(value) => {
                        setSelectedState(value);
                        setSelectedCity(""); // Reset city when state changes
                      }}
                      disabled={currentSubscription === "free"}
                    >
                      <SelectTrigger className="border-orange-200">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All States</SelectItem>
                        {Object.keys(stateCities).map((state) => (
                          <SelectItem key={state} value={state}>
                            {state.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-2 block">Religion
                      {currentSubscription === "free" && (
                        <span className="text-gray-400 text-xs"> (Premium)</span>
                      )}
                    </Label>
                    <Select
                      value={selectedReligion}
                      onValueChange={(value) => {
                        setSelectedReligion(value);
                      }}
                      disabled={currentSubscription === "free"}
                    >
                      <SelectTrigger className="border-orange-200">
                        <SelectValue placeholder="Select religion" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Religions</SelectItem>
                        {religions.map((religion) => (
                          <SelectItem key={religion._id} value={religion.name}>
                            {religion.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-2 block">Profession
                      {currentSubscription === "free" && (
                        <span className="text-gray-400 text-xs"> (Premium)</span>
                      )}
                    </Label>
                    <Select
                      value={selectedProfession}
                      onValueChange={setSelectedProfession}
                      disabled={currentSubscription === "free"}
                    >
                      <SelectTrigger className="border-orange-200">
                        <SelectValue placeholder="Select profession" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Professions</SelectItem>
                        <SelectItem value="software-engineer">Engineer</SelectItem>
                        <SelectItem value="doctor">Doctor</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="government">Government Job</SelectItem>
                        <SelectItem value="banking">Banking</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-2 block">
                      Community
                      {currentSubscription === "free" && (
                        <span className="text-gray-400 text-xs"> (Premium)</span>
                      )}
                    </Label>
                    <Select
                      value={selectedCommunity}
                      onValueChange={setSelectedCommunity}
                      disabled={currentSubscription === "free"}
                    >
                      <SelectTrigger className="border-orange-200">
                        <SelectValue placeholder="Select community" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Communities</SelectItem>
                        {filteredCommunities.map((community) => (
                          <SelectItem key={community._id} value={community.name}>
                            {community.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-2 block">
                      Education
                      {currentSubscription === "free" && (
                        <span className="text-gray-400 text-xs"> (Premium)</span>
                      )}
                    </Label>
                    <Select
                      value={selectedEducation}
                      onValueChange={setSelectedEducation}
                      disabled={currentSubscription === "free"}
                    >
                      <SelectTrigger className="border-orange-200">
                        <SelectValue placeholder="Select education" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Educations</SelectItem>
                        <SelectItem value="high-school">High-school</SelectItem>
                        <SelectItem value="diploma">Diploma</SelectItem>
                        <SelectItem value="bachelor">Bachelor Degree</SelectItem>
                        <SelectItem value="master">Master's Degree</SelectItem>
                        <SelectItem value="phd">PhD</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-2 block">
                      Annual Income
                      {currentSubscription === "free" && (
                        <span className="text-gray-400 text-xs"> (Premium)</span>
                      )}
                    </Label>
                    <Select
                      value={selectedIncome}
                      onValueChange={setSelectedIncome}
                      disabled={currentSubscription === "free"}
                    >
                      <SelectTrigger className="border-orange-200">
                        <SelectValue placeholder="Select income range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Incomes</SelectItem>
                        <SelectItem value="2-5">₹2-5 Lakhs</SelectItem>
                        <SelectItem value="5-10">₹5-10 Lakhs</SelectItem>
                        <SelectItem value="10-15">₹10-15 Lakhs</SelectItem>
                        <SelectItem value="15-25">₹15-25 Lakhs</SelectItem>
                        <SelectItem value="25-50">₹25-50 Lakhs</SelectItem>
                        <SelectItem value="50+">₹50+ Lakhs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>
                      Horoscope Match
                      {currentSubscription !== "premium plus" && (
                        <span className="text-gray-400 text-xs"> (Premium+)</span>
                      )}
                    </Label>
                    <Switch
                      checked={horoscopeMatch}
                      onCheckedChange={setHoroscopeMatch}
                      disabled={currentSubscription !== "premium plus"}
                    />
                  </div>

                  <Button
                    onClick={handleSearch}
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700"
                  >
                    <SearchIcon size={16} className="mr-2" />
                    Search Profiles
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Search Results
                </h2>
                <p className="text-gray-600">
                  {fetchError
                    ? "Error loading profiles"
                    : showResults
                      ? displayProfiles.length > 0
                        ? `Showing ${displayProfiles.length} profiles matching your criteria`
                        : "No profiles match your criteria. Try adjusting your filters or check back later."
                      : "Use filters to find your perfect match"}
                </p>
              </div>
              {showResults && !fetchError && (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    variant={viewMode === "grid" ? "default" : "outline"}
                    className={
                      viewMode === "grid"
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "border-yellow-300"
                    }
                  >
                    <Grid size={16} />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setViewMode("list")}
                    variant={viewMode === "list" ? "default" : "outline"}
                    className={
                      viewMode === "list"
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "border-yellow-300"
                    }
                  >
                    <List size={16} />
                  </Button>
                </div>
              )}
            </div>
            {fetchError ? (
              <div className="text-center text-red-600">{fetchError}</div>
            ) : (
              <div
                className={`grid ${viewMode === "grid"
                    ? "md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "gap-4"
                  }`}
              >
                {displayProfiles.length > 0
                  ? displayProfiles.map((profile) => (
                    <Card
                      key={profile.id}
                      className={`overflow-hidden hover:shadow-lg transition-shadow border-yellow-200 ${viewMode === "list" ? "flex" : ""
                        }`}
                    >
                      <div
                        className={`relative ${viewMode === "list" ? "w-32 h-32" : "aspect-square"
                          }`}
                      >
                        <img
                          src={profile.image}
                          alt={profile.name}
                          className="w-full h-full object-cover"
                        />
                        {popularFilter && (profile.viewCount || profile.interestsReceived) > 10 && (
                          <Badge className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs">
                            <Star size={12} className="mr-1" /> Popular
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {profile.name}
                          </h3>
                          {profile.subscription === "premium plus" && (
                            <Badge className="bg-purple-100 text-purple-800 text-xs">
                              Premium Plus
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-1 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <User size={14} />
                            <span>{profile.age} years</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase size={14} />
                            <span>{profile.profession}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            <span>{profile.location}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => handlePass(profile.id)}
                          >
                            <X size={16} className="mr-1" /> Pass
                          </Button>
                          <Button
                            size="sm"
                            className={`flex-1 ${interestedProfiles.includes(
                              profile.id?.toString()
                            )
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700"
                              }`}
                            onClick={() => sendInterest(profile.id)}
                            disabled={interestedProfiles.includes(
                              profile.id?.toString()
                            )}
                          >
                            <Heart size={16} className="mr-1" />
                            {interestedProfiles.includes(
                              profile.id?.toString()
                            )
                              ? "Sent"
                              : "Interest"}
                          </Button>
                        </div>
                        <Link
                          to={`/profile/${profile.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            handleProfileView(profile.id).finally(() => {
                              window.location.href = `/profile/${profile.id}`;
                            });
                          }}
                        >
                          <Button
                            variant="ghost"
                            className="w-full mt-2 text-yellow-600 hover:bg-yellow-50"
                          >
                            View Profile
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))
                  : showResults && (
                    <div className="text-center text-gray-600">
                      No profiles match your criteria. Try adjusting your
                      filters or check back later.
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;