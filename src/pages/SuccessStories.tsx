import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Calendar, MapPin, Quote, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const API_BASE_URL = "http://localhost:5000";

const SuccessStories = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    names: "",
    weddingDate: "",
    location: "",
    email: "",
    story: "",
    imageUrl: "",
    imageFile: null as File | null,
  });
  const [submittedStories, setSubmittedStories] = useState<
    {
      _id: string;
      names: string;
      weddingDate: string;
      location: string;
      story: string;
      image: string;
      createdAt: string;
    }[]
  >([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageOption, setImageOption] = useState<"url" | "file">("url");
  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof formData | "image", string>>
  >({});

  // Fetch stories on component mount
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/stories`);
        setSubmittedStories(response.data);
      } catch (error) {
        console.error("Error fetching stories:", error);
        alert("Failed to fetch stories. Please try again later.");
      }
    };
    fetchStories();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, imageFile: file, imageUrl: "" }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, imageFile: null }));
      setImagePreview(null);
    }
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, imageUrl: value, imageFile: null }));
    setImagePreview(value || null);
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof typeof formData | "image", string>> =
      {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const today = new Date();
    const inputDate = formData.weddingDate
      ? new Date(formData.weddingDate)
      : null;

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Wedding date validation
    if (!formData.weddingDate) {
      newErrors.weddingDate = "Wedding date is required";
    } else if (inputDate && inputDate > today) {
      newErrors.weddingDate = "Wedding date must be in the past";
    }

    // Image validation
    if (!formData.imageUrl && !formData.imageFile) {
      newErrors.image = "Please provide an image URL or upload an image";
    }

    // Names validation
    if (!formData.names.trim()) {
      newErrors.names = "Names are required";
    }

    // Location validation
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    // Story validation
    if (!formData.story.trim()) {
      newErrors.story = "Your love story is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append("names", formData.names);
      data.append("weddingDate", formData.weddingDate);
      data.append("location", formData.location);
      data.append("email", formData.email);
      data.append("story", formData.story);
      if (formData.imageFile) {
        data.append("image", formData.imageFile);
      } else {
        data.append("imageUrl", formData.imageUrl);
      }

      const response = await axios.post(`${API_BASE_URL}/api/stories`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSubmittedStories((prev) => [response.data, ...prev]);
      setFormData({
        names: "",
        weddingDate: "",
        location: "",
        email: "",
        story: "",
        imageUrl: "",
        imageFile: null,
      });
      setImagePreview(null);
      setImageOption("url");
      setErrors({});
      alert("Thank you for sharing your story!");
    } catch (error: any) {
      console.error("Error submitting story:", error);
      alert(
        error.response?.data?.error ||
          "Failed to submit story. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-red-50">
      <Header />

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <Heart className="mx-auto mb-6 h-16 w-16 text-pink-200 animate-pulse" />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
            Love Stories That Inspire
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-pink-100 max-w-3xl mx-auto leading-relaxed">
            Discover beautiful journeys of couples who found their soulmates
            through KannadaMatch. Their stories prove that true love knows no
            boundaries.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Share Your Story Section */}
        <div className="relative px-2 sm:px-4">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-orange-500/10 to-red-500/10 rounded-3xl"></div>
          <Card className="relative max-w-4xl mx-auto border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6 md:p-12">
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-pink-500 to-red-500 rounded-full mb-6">
                  <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-white fill-current" />
                </div>
                <h2 className="text-xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-4">
                  Share Your Love Story
                </h2>
                <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
                  Found your perfect match through KannadaMatch? We'd love to
                  celebrate your journey and inspire others looking for love!
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                      Your Names *
                    </label>
                    <Input
                      name="names"
                      value={formData.names}
                      onChange={handleInputChange}
                      placeholder="e.g., Priya & Suresh"
                      className={`h-10 sm:h-12 border-2 ${
                        errors.names ? "border-red-400" : "border-pink-100"
                      } focus:border-pink-400 bg-white/50 text-xs sm:text-sm`}
                      required
                    />
                    {errors.names && (
                      <p className="text-red-500 text-xs">{errors.names}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                      Wedding Date *
                    </label>
                    <Input
                      name="weddingDate"
                      value={formData.weddingDate}
                      onChange={handleInputChange}
                      type="date"
                      max={new Date().toISOString().split("T")[0]}
                      className={`h-10 sm:h-12 border-2 ${
                        errors.weddingDate
                          ? "border-red-400"
                          : "border-pink-100"
                      } focus:border-pink-400 bg-white/50 text-xs sm:text-sm`}
                      required
                    />
                    {errors.weddingDate && (
                      <p className="text-red-500 text-xs">
                        {errors.weddingDate}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                      Wedding Location *
                    </label>
                    <Input
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., Bangalore"
                      className={`h-10 sm:h-12 border-2 ${
                        errors.location ? "border-red-400" : "border-pink-100"
                      } focus:border-pink-400 bg-white/50 text-xs sm:text-sm`}
                      required
                    />
                    {errors.location && (
                      <p className="text-red-500 text-xs">{errors.location}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                      Your Email *
                    </label>
                    <Input
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      type="email"
                      placeholder="your.email@example.com"
                      className={`h-10 sm:h-12 border-2 ${
                        errors.email ? "border-red-400" : "border-pink-100"
                      } focus:border-pink-400 bg-white/50 text-xs sm:text-sm`}
                      required
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                    Add Your Image *
                  </label>
                  <p className="text-xs sm:text-sm text-gray-500 mb-2">
                    Please provide either an image URL or upload an image file
                    (jpg, png, gif, max 5MB).
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="imageOption"
                        value="url"
                        checked={imageOption === "url"}
                        onChange={() => {
                          setImageOption("url");
                          setFormData((prev) => ({
                            ...prev,
                            imageFile: null,
                          }));
                          setImagePreview(formData.imageUrl || null);
                        }}
                        className="h-4 w-4 text-pink-500 focus:ring-pink-400"
                      />
                      <label className="text-xs sm:text-sm text-gray-700">
                        Image URL
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="imageOption"
                        value="file"
                        checked={imageOption === "file"}
                        onChange={() => {
                          setImageOption("file");
                          setFormData((prev) => ({ ...prev, imageUrl: "" }));
                          setImagePreview(
                            formData.imageFile ? imagePreview : null
                          );
                        }}
                        className="h-4 w-4 text-pink-500 focus:ring-pink-400"
                      />
                      <label className="text-xs sm:text-sm text-gray-700">
                        Upload Image
                      </label>
                    </div>
                  </div>
                  <div className="mt-2">
                    {imageOption === "url" ? (
                      <Input
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleImageUrlChange}
                        placeholder="e.g., https://example.com/image.jpg"
                        className={`h-10 sm:h-12 border-2 ${
                          errors.image ? "border-red-400" : "border-pink-100"
                        } focus:border-pink-400 bg-white/50 text-xs sm:text-sm`}
                      />
                    ) : (
                      <Input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif"
                        onChange={handleFileChange}
                        className={`h-10 sm:h-12 border-2 ${
                          errors.image ? "border-red-400" : "border-pink-100"
                        } focus:border-pink-400 bg-white/50 text-xs sm:text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100`}
                      />
                    )}
                    {errors.image && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.image}
                      </p>
                    )}
                  </div>
                  {imagePreview && (
                    <div className="mt-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full max-w-xs rounded-lg shadow-md"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                    Your Love Story *
                  </label>
                  <Textarea
                    name="story"
                    value={formData.story}
                    onChange={handleInputChange}
                    placeholder="Tell us how you met through KannadaMatch, your journey to marriage, and what made your connection special..."
                    rows={5}
                    className={`border-2 ${
                      errors.story ? "border-red-400" : "border-pink-100"
                    } focus:border-pink-400 bg-white/50 resize-none text-xs sm:text-sm`}
                    required
                  />
                  {errors.story && (
                    <p className="text-red-500 text-xs">{errors.story}</p>
                  )}
                </div>

                <div className="text-center">
                  <Button
                    disabled={loading}
                    type="submit"
                    className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-12 text-sm sm:text-lg font-semibold bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 hover:from-pink-600 hover:via-red-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    {loading && (
                      <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                    )}
                    {loading ? "Sharing..." : "Share Your Beautiful Story"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Stories Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20 mt-16">
          {submittedStories.map((story) => (
            <Card
              key={story._id}
              className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm"
            >
              <div className="relative">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={
                      story.image.startsWith("http")
                        ? story.image
                        : `${API_BASE_URL}${story.image}`
                    }
                    alt={story.names}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3">
                  <Heart className="h-6 w-6 text-red-500 fill-current" />
                </div>
              </div>

              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {story.names}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(story.weddingDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {story.location}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 h-8 w-8 text-pink-200" />
                  <p className="text-gray-600 leading-relaxed pl-6 italic text-sm sm:text-base md:text-lg">
                    {story.story}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SuccessStories;
