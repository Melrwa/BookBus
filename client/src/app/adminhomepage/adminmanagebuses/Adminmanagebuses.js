"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import * as Dialog from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";

const ManageBuses = () => {
  const [buses, setBuses] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const router = useRouter();


  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const response = await fetch("/api/buses");
      const data = await response.json();
      console.log("Fetched buses:", data); // Log the response
      if (Array.isArray(data)) {
        setBuses(data);
      } else {
        console.error("Expected an array of buses, but got:", data);
        setBuses([]); // Set buses to an empty array to avoid errors
      }
    } catch (error) {
      console.error("Failed to fetch buses:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleEdit = (index) => {
    setEditIndex(index);
    setEditData({ ...buses[index] });
  };

  const handleEditChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
    setErrors({ ...errors, [field]: "" }); // Clear validation errors when the user types
  };

  const validateForm = () => {
    const newErrors = {};
    if (!editData.bus_number) newErrors.bus_number = "Bus number is required.";
    if (!editData.capacity) newErrors.capacity = "Capacity is required.";
    if (!editData.route) newErrors.route = "Route is required.";
    if (!editData.company_id) newErrors.company_id = "Company ID is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleEditSave = async () => {
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    try {
      const response = await fetch(`/api/buses/${editData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        const updatedBus = await response.json();
        const updatedBuses = [...buses];
        updatedBuses[editIndex] = updatedBus;
        setBuses(updatedBuses);
        setEditIndex(null);
        setEditData(null);
      } else {
        const errorData = await response.json();
        console.error("Failed to update bus:", errorData.error);
      }
    } catch (error) {
      console.error("Error updating bus:", error);
    }
  };

  const handleDelete = async () => {
    const busId = buses[deleteIndex].id;
    try {
      const response = await fetch(`/api/buses/${busId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setBuses(buses.filter((_, index) => index !== deleteIndex));
        setDeleteIndex(null);
      } else {
        const errorData = await response.json();
        console.error("Failed to delete bus:", errorData.error);
      }
    } catch (error) {
      console.error("Error deleting bus:", error);
    }
  };

  const handleAddBus = () => {
    router.push("/adminhomepage/addbuses");
  };

  if (loading) {
    return <div className="bg-black min-h-screen flex items-center justify-center text-yellow-500">Loading...</div>;
  }

  return (
    <div className="bg-black min-h-screen flex flex-col items-center py-10">
      <h1 className="text-yellow-500 text-3xl font-bold mb-6">Admin Manage Buses</h1>
      <Button className="bg-blue-600 hover:bg-blue-700 text-white mb-6" onClick={handleAddBus}>
        Add Bus
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {buses.map((bus, index) => (
          <Card key={index} className="bg-gray-900 text-white w-80">
            <img src={bus.image_url || "/default-bus.jpg"} alt="Bus" className="w-full h-40 object-cover" />
            <CardContent>
              <p><span className="font-bold">Bus Number:</span> <span className="text-yellow-500">{bus.bus_number}</span></p>
              <p><span className="font-bold">Capacity:</span> <span className="text-yellow-500">{bus.capacity}</span></p>
              <p><span className="font-bold">Available Seats:</span> <span className="text-yellow-500">{bus.seats_available}</span></p>
              <p><span className="font-bold">Route:</span> <span className="text-yellow-500">{bus.route}</span></p>
              <p><span className="font-bold">Company ID:</span> <span className="text-yellow-500">{bus.company_id}</span></p>
              <div className="flex justify-between mt-4">
                <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => setDeleteIndex(index)}>
                  Delete
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleEdit(index)}>
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteIndex !== null && (
        <Dialog.Root open={true} onOpenChange={() => setDeleteIndex(null)}>
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
          <Dialog.Content className="fixed inset-0 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <Dialog.Title className="text-lg font-bold">Confirm Deletion</Dialog.Title>
              <p>Are you sure you want to delete this bus?</p>
              <div className="flex justify-end mt-4">
                <Button className="bg-gray-500 hover:bg-gray-600" onClick={() => setDeleteIndex(null)}>
                  Cancel
                </Button>
                <Button className="bg-red-600 hover:bg-red-700 ml-2" onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Root>
      )}

      {/* Edit Bus Modal */}
      {editIndex !== null && (
        <Dialog.Root open={true} onOpenChange={() => setEditIndex(null)}>
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
          <Dialog.Content className="fixed inset-0 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <Dialog.Title className="text-lg font-bold">Edit Bus Details</Dialog.Title>
              <input
                type="text"
                className="w-full p-2 border rounded mb-2"
                value={editData.bus_number}
                onChange={(e) => handleEditChange("bus_number", e.target.value)}
                placeholder="Bus Number"
              />
              {errors.bus_number && <p className="text-red-500 text-sm mt-1">{errors.bus_number}</p>}
              <input
                type="number"
                className="w-full p-2 border rounded mb-2"
                value={editData.capacity}
                onChange={(e) => handleEditChange("capacity", e.target.value)}
                placeholder="Capacity"
              />
              {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
              <input
                type="text"
                className="w-full p-2 border rounded mb-2"
                value={editData.route}
                onChange={(e) => handleEditChange("route", e.target.value)}
                placeholder="Route"
              />
              {errors.route && <p className="text-red-500 text-sm mt-1">{errors.route}</p>}
              <div className="flex justify-end mt-4">
                <Button className="bg-gray-500 hover:bg-gray-600" onClick={() => setEditIndex(null)}>
                  Cancel
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 ml-2" onClick={handleEditSave}>
                  Save
                </Button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Root>
      )}
    </div>
  );
};

export default ManageBuses;