import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateActivityModal } from "./create-activity-modal";
import { ImportantLinks } from "./important-links";
import { GuestsList } from "./guests-list";
import { ActivityList } from "./activity-list";
import { DestinationAndDateHeader } from "./destination-and-date-header";
import { Button } from "../../components/button";


export function TripDeailsPage(){
    const[isCreateActivityModalOpen, setIsCreateActivityModalOpen] = useState(false)
    
    function openCreateActivityModal(){
        setIsCreateActivityModalOpen(true)
    }
    function closeCreateActivityModal(){
        setIsCreateActivityModalOpen(false)
    }
    
    return (
        <div className="max-w-6xl px-24 py-10 mx-auto space-y-8">
            
            <DestinationAndDateHeader/>

            <main className="flex gap-16 px-6">
                <div className="flex-1 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-semibold">Atividades</h2>
                        <Button onClick={openCreateActivityModal}  variant="primary">
                            Cadastrar Atividade
                            <Plus className="size-5" />
                        </Button>
                    </div>
                    <ActivityList/>
                    
                </div>

                <div className="w-80 space-y-6">
                    
                    <ImportantLinks/>

                    <div className="w-full h-px bg-zinc-800" />
                    
                    <GuestsList/>
                   
                </div>
            </main>

            {isCreateActivityModalOpen && (
                 <CreateActivityModal
                  closeCreateActivityModal={closeCreateActivityModal}
                 />
            )}

        </div>
    )
}