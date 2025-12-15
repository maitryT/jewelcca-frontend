import React from 'react';
import { Crown, Award, Users, Heart, Shield, Sparkles } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
            About Jewelcca
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            For over three decades, we've been crafting exquisite jewelry that celebrates life's most precious moments. 
            Our commitment to quality, artistry, and customer satisfaction has made us a trusted name in fine jewelry.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Founded in 1990 by master jeweler Antonio Jewelcca, our company began as a small family workshop 
                with a simple mission: to create jewelry that tells stories and captures emotions.
              </p>
              <p>
                What started as a passion project has grown into a renowned jewelry house, but our values remain 
                unchanged. We believe that every piece of jewelry should be as unique as the person who wears it, 
                crafted with the finest materials and meticulous attention to detail.
              </p>
              <p>
                Today, we continue to honor traditional craftsmanship while embracing modern techniques, ensuring 
                that each piece meets the highest standards of quality and beauty.
              </p>
            </div>
          </div>
          <div>
            <img
              src="https://images.pexels.com/photos/1232166/pexels-photo-1232166.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Jewelry craftsmanship"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-serif font-bold text-gray-900 text-center mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Excellence</h3>
              <p className="text-gray-600">
                We strive for perfection in every piece, using only the finest materials and expert craftsmanship.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Passion</h3>
              <p className="text-gray-600">
                Our love for jewelry drives us to create pieces that inspire and captivate.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Trust</h3>
              <p className="text-gray-600">
                We build lasting relationships with our customers through honesty and integrity.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation</h3>
              <p className="text-gray-600">
                We blend traditional techniques with modern innovation to create timeless pieces.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Community</h3>
              <p className="text-gray-600">
                We're proud to be part of our customers' special moments and life celebrations.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Recognition</h3>
              <p className="text-gray-600">
                Our commitment to quality has earned us numerous awards and certifications.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-serif font-bold text-gray-900 text-center mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <img
                src="https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Antonio Jewelcca"
                className="w-48 h-48 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Antonio Jewelcca</h3>
              <p className="text-primary-600 font-medium mb-2">Founder & Master Jeweler</p>
              <p className="text-gray-600 text-sm">
                With over 40 years of experience, Antonio brings unparalleled expertise to every design.
              </p>
            </div>
            
            <div className="text-center">
              <img
                src="https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Maria Rodriguez"
                className="w-48 h-48 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Maria Rodriguez</h3>
              <p className="text-primary-600 font-medium mb-2">Head Designer</p>
              <p className="text-gray-600 text-sm">
                Maria's creative vision brings contemporary elegance to our classic designs.
              </p>
            </div>
            
            <div className="text-center">
              <img
                src="https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="James Chen"
                className="w-48 h-48 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">James Chen</h3>
              <p className="text-primary-600 font-medium mb-2">Quality Assurance Director</p>
              <p className="text-gray-600 text-sm">
                James ensures every piece meets our exacting standards before reaching our customers.
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-primary-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
            Experience the Jewelcca Difference
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Visit our showroom or browse our online collection to discover jewelry that celebrates your unique story. 
            Our expert consultants are here to help you find the perfect piece.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
              Schedule Consultation
            </button>
            <button className="border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 hover:text-white transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}