import {useState, useEffect, useCallback} from "react"
import {BiCalendar} from "react-icons/bi"
import Search from './components/Search'
import AddAppointment from './components/AddAppointment'
import AppointmentInfo from "./components/AppointmentInfo"

function App() {
  const [appointmentList, setAppointmentList] = useState([])
  const [query, setQuery] = useState("")
  const [sortBy, setSortBy] = useState('petName')
  const [orderBy, setOrderBy] = useState('asc')

  let filteredAppointment = appointmentList.filter(
    appointment => appointment.petName.toLowerCase().includes(query.toLowerCase()) ||
      appointment.ownerName.toLowerCase().includes(query.toLowerCase()) ||
      appointment.aptNotes.toLowerCase().includes(query.toLowerCase())
  ).sort((a, b) => {
    let order = (orderBy === 'asc') ? 1 : -1
    return a[sortBy].toLowerCase() < b[sortBy].toLowerCase() ? -1 * order : order
  })

  const fetchData = useCallback(() => {
    fetch('./data.json')
      .then(response => response.json())
      .then(data => {
        setAppointmentList(data)
      })
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const onDeleteAppointment = id => setAppointmentList(appointmentList.filter(appointment => appointment.id !== id))
  const onQueryChange = value => setQuery(value)
  const onOrderByChange = myOrder => setOrderBy(myOrder)
  const onSortByChange = mySort => setSortBy(mySort)
  const onSendAppointment = MyAppointment => setAppointmentList([...appointmentList, MyAppointment])

  return (
    <div className="App container mx-auto mt-3 font-thin">
      <h1 className="text-5xl mb-3">
        <BiCalendar className="inline-block text-red-400 align-top"/> Your Appointment
      </h1>

      <AddAppointment lastId={filteredAppointment.length} onSendAppointment={onSendAppointment}/>

      <Search
        onQueryChange={onQueryChange} query={query}
        orderBy={orderBy} onOrderByChange={onOrderByChange}
        sortBy={sortBy} onSortByChange={onSortByChange}
      />

      <ul className="divide-y divide-gray-200">
        {filteredAppointment.map(appointment => (
          <AppointmentInfo onDeleteAppointment={onDeleteAppointment} appointment={appointment} key={appointment.id}/>
        ))}
      </ul>
    </div>
  );
}

export default App;
