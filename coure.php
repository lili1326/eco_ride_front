	<?php
	 
	// On récupère l’Entity Manager avec notre configuration SQL (type de connexion),
	// L’Entity Manager est l’objet de Doctrine qui nous permet d’interagir avec notre base de données.
	$entityManager = new EntityManager($connection, $config); 
	
	// On crée un simple objet (ici Product) que l’on veut sauvegarder en base.
	$product = new Product() ;
	
	// On hydrate celui-ci de données.
	$product->name = 'Casque audio sans fil'; 
	$product->price = 50;
	
	// Puis on sauvegarde avec Doctrine l’objet en base de données.
	$entityManager->persist($product);
	$entityManager->flush();
	
	echo "Created Product with ID " . $product->getId() . "\n";
	
	?>