-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create medicinal products table
CREATE TABLE public.medicinal_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  disposal_instructions TEXT NOT NULL,
  hazard_level TEXT CHECK (hazard_level IN ('low', 'medium', 'high', 'critical')),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.medicinal_products ENABLE ROW LEVEL SECURITY;

-- Products are viewable by everyone
CREATE POLICY "Products are viewable by everyone"
  ON public.medicinal_products FOR SELECT
  USING (true);

-- Create resources table for video tutorials
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Resources are viewable by everyone
CREATE POLICY "Resources are viewable by everyone"
  ON public.resources FOR SELECT
  USING (true);

-- Create wishlist table
CREATE TABLE public.wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.medicinal_products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT wishlist_item_check CHECK (
    (resource_id IS NOT NULL AND product_id IS NULL) OR
    (resource_id IS NULL AND product_id IS NOT NULL)
  )
);

-- Enable RLS
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- Wishlist policies
CREATE POLICY "Users can view own wishlist"
  ON public.wishlist FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into own wishlist"
  ON public.wishlist FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from own wishlist"
  ON public.wishlist FOR DELETE
  USING (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Trigger for profiles updated_at
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Insert some sample medicinal products
INSERT INTO public.medicinal_products (name, category, description, disposal_instructions, hazard_level, image_url) VALUES
('Expired Antibiotics', 'Pharmaceuticals', 'Common antibiotics past expiration date', 'Return to pharmacy take-back program. Do not flush or throw in trash. Antibiotics can contaminate water systems and contribute to antibiotic resistance.', 'medium', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400'),
('Unused Chemotherapy Drugs', 'Hazardous', 'Cytotoxic medications for cancer treatment', 'Must be disposed through specialized medical waste facility. Contact local hospital pharmacy for proper disposal. Never handle without protection.', 'critical', 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400'),
('Pain Medications (Opioids)', 'Controlled Substances', 'Narcotic pain relievers', 'Use drug take-back programs or FDA-approved disposal methods. Mix with coffee grounds or cat litter in sealed bag if no take-back available.', 'high', 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400'),
('Insulin & Needles', 'Sharps', 'Diabetes management supplies', 'Place needles in FDA-approved sharps container. Insulin can go in regular trash when empty. Never recap needles. Contact local waste management for sharps disposal.', 'medium', 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400'),
('Topical Creams/Ointments', 'Pharmaceuticals', 'Medicated skin treatments', 'Squeeze out contents into sealed bag with absorbent material. Recycle empty tubes if possible. Safe for regular trash disposal when empty.', 'low', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'),
('Expired Vaccines', 'Biologics', 'Immunization products past expiration', 'Return to healthcare provider or pharmacy. Must be disposed as biohazardous waste. Never throw in regular trash or recycle.', 'high', 'https://images.unsplash.com/photo-1587854680352-936b22b91030?w=400');

-- Insert some sample resources
INSERT INTO public.resources (title, description, video_url, thumbnail_url, duration, category) VALUES
('Safe Medical Waste Disposal at Home', 'Learn the proper techniques for disposing of medical waste in your home safely', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400', '5:30', 'Home Safety'),
('Understanding Pharmaceutical Waste', 'Complete guide to identifying and categorizing pharmaceutical waste', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400', '8:45', 'Education'),
('Sharps Container Usage Guide', 'Step-by-step tutorial on proper sharps container usage and disposal', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400', '4:20', 'Safety'),
('Environmental Impact of Medical Waste', 'Understanding how improper disposal affects our environment', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400', '10:15', 'Environment'),
('Community Take-Back Programs', 'How to find and use medication take-back programs in your area', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400', '6:50', 'Community'),
('Healthcare Professional Guidelines', 'Best practices for medical professionals handling waste disposal', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400', '12:30', 'Professional');