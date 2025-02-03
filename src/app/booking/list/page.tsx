import BookingList from "@/components/BookingList";
import RouteGuard from "@/components/RouteGuard";

const BookingPage = () => {
  return (
    <div className="flex-col justify-center items-center min-h-screen bg-gray-100">
      <BookingList />
    </div>
  );
}

const ProtectedBookingPage = ()=>{
  return (
    <RouteGuard>
      {<BookingPage />}
    </RouteGuard>
  )

}

export default ProtectedBookingPage