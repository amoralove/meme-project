-- Seed data for development
-- Run this in the Supabase SQL editor after creating tables (see README.md)

-- Sample shelters
INSERT INTO shelters (id, name, email, phone, city, state, zip, description, verified) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'Happy Tails Rescue', 'info@happytails.org', '555-0101', 'Austin', 'TX', '78701', 'A foster-based rescue dedicated to finding loving homes for dogs in Central Texas.', true),
  ('a2222222-2222-2222-2222-222222222222', 'Second Chance Animal Shelter', 'adopt@secondchance.org', '555-0102', 'Portland', 'OR', '97201', 'We believe every dog deserves a second chance at a loving home.', true),
  ('a3333333-3333-3333-3333-333333333333', 'Golden Years Rescue', 'hello@goldenyears.org', '555-0103', 'Denver', 'CO', '80201', 'Specializing in senior dogs who still have so much love to give.', true),
  ('a4444444-4444-4444-4444-444444444444', 'Paws of Hope', 'contact@pawsofhope.org', '555-0104', 'Seattle', 'WA', '98101', 'Rescuing dogs from high-kill shelters and finding them forever homes.', true),
  ('a5555555-5555-5555-5555-555555555555', 'Furever Friends Rescue', 'adopt@fureverfriends.org', '555-0105', 'Nashville', 'TN', '37201', 'Connecting great dogs with great families since 2018.', true);

-- Sample dogs
INSERT INTO dogs (shelter_id, name, breed_primary, breed_secondary, age_years, age_months, size, weight_lbs, sex, energy_level, good_with_kids, good_with_dogs, good_with_cats, house_trained, personality, adoption_fee_cents, status, source) VALUES
  -- Happy Tails Rescue
  ('a1111111-1111-1111-1111-111111111111', 'Luna', 'Labrador Retriever', 'Pit Bull Terrier', 2, 0, 'medium', 52, 'female', 'high', true, true, false, true,
   'Luna is the ultimate adventure buddy. She loves fetch, swimming, hiking — basically anything that involves being outside with her person. She greets everyone with a full-body wiggle and has never met a stranger. Luna would do best in an active home with a yard.', 25000, 'available', 'manual'),

  ('a1111111-1111-1111-1111-111111111111', 'Patches', 'Australian Shepherd', 'Border Collie', 1, 6, 'medium', 45, 'male', 'high', true, true, true, true,
   'Patches is whip-smart and eager to learn. He already knows sit, down, shake, and spin. He needs a job to do — agility, herding, or even just puzzle toys. Patches would thrive with an experienced owner who can channel his energy.', 30000, 'available', 'manual'),

  -- Second Chance
  ('a2222222-2222-2222-2222-222222222222', 'Benny', 'Beagle', null, 5, 0, 'small', 24, 'male', 'low', true, true, true, true,
   'Benny is the definition of a couch potato. His ideal day involves a leisurely walk, several naps, and snuggling on the couch. He gets along with everyone — kids, dogs, cats, you name it. Perfect for first-time owners or apartment living.', 17500, 'available', 'manual'),

  ('a2222222-2222-2222-2222-222222222222', 'Daisy', 'Chihuahua', 'Dachshund', 3, 0, 'small', 12, 'female', 'moderate', true, true, false, true,
   'Daisy is tiny but mighty. She has a big personality packed into a small body. She loves to play but also enjoys lap time. Daisy bonds deeply with her person and would prefer a home without cats.', 15000, 'available', 'manual'),

  -- Golden Years
  ('a3333333-3333-3333-3333-333333333333', 'Rosie', 'Poodle', 'Bichon Frise', 9, 0, 'small', 15, 'female', 'low', true, true, true, true,
   'Rosie is a gentle soul who has so much love to give. She is calm, quiet, and the perfect lap dog. She loves being brushed and will lean into you for pets. Rosie deserves a quiet, loving home for her golden years.', 10000, 'available', 'manual'),

  ('a3333333-3333-3333-3333-333333333333', 'Walter', 'Golden Retriever', null, 10, 0, 'large', 75, 'male', 'low', true, true, true, true,
   'Walter is a dignified gentleman who still has a puppy spark in his eyes. He loves slow walks, belly rubs, and sleeping by your feet. He is incredibly gentle with kids and other animals. Walter is on joint supplements but otherwise healthy.', 7500, 'available', 'manual'),

  -- Paws of Hope
  ('a4444444-4444-4444-4444-444444444444', 'Duke', 'German Shepherd', 'Husky', 3, 0, 'large', 80, 'male', 'high', true, false, false, true,
   'Duke is smart, loyal, and devoted. He bonds deeply with his person and is protective of his family. He needs an experienced owner, a yard, and plenty of exercise. Duke excels at obedience and would love a job.', 30000, 'available', 'manual'),

  ('a4444444-4444-4444-4444-444444444444', 'Shadow', 'Black Labrador', null, 4, 0, 'large', 68, 'male', 'moderate', true, true, true, true,
   'Shadow is the perfect family dog. He is calm in the house but loves to play outside. He is great on leash, knows basic commands, and is gentle with everyone. Shadow has been overlooked because of his color — but his personality is gold.', 20000, 'available', 'manual'),

  -- Furever Friends
  ('a5555555-5555-5555-5555-555555555555', 'Maple', 'Corgi', 'Beagle', 1, 6, 'medium', 30, 'female', 'moderate', true, true, true, true,
   'Maple is playful, clever, and full of personality. She will do anything for a treat and has already mastered several tricks. She gets along with everyone and adapts quickly to new situations. Maple would be great for first-time owners.', 27500, 'available', 'manual'),

  ('a5555555-5555-5555-5555-555555555555', 'Bear', 'Chow Chow', 'Shar Pei', 6, 0, 'large', 60, 'male', 'low', false, false, false, true,
   'Bear is independent, dignified, and surprisingly cuddly once he trusts you. He prefers a quiet home without small children or other pets. Bear needs an experienced owner who understands his reserved nature. Once he bonds with you, he is loyal for life.', 20000, 'available', 'manual'),

  ('a5555555-5555-5555-5555-555555555555', 'Poppy', 'Terrier Mix', null, 0, 8, 'small', 15, 'female', 'high', true, true, null, false,
   'Poppy is an adorable puppy with boundless energy and a wagging tail. She is still learning the basics — house training is in progress. She loves to play with other dogs and is great with gentle kids. Puppy classes recommended!', 35000, 'available', 'manual'),

  ('a1111111-1111-1111-1111-111111111111', 'Gus', 'Pit Bull Terrier', 'Boxer', 4, 0, 'large', 65, 'male', 'moderate', true, true, false, true,
   'Gus is a big baby in a muscular body. He loves cuddles, car rides, and meeting new people. He is gentle, patient, and incredibly loyal. Gus has been at the shelter for 3 months and deserves a chance. He would prefer a home without cats.', 15000, 'available', 'manual');
